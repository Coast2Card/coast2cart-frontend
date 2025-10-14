import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("x-access-token", token);
    }
    return headers;
  },
});

const baseQueryWithFriendlyErrors = async (args, apiCtx, extraOptions) => {
  let result;
  try {
    const path = typeof args === "string" ? args : args?.url;
    const method = typeof args === "string" ? "GET" : args?.method || "GET";
    const body = typeof args === "string" ? undefined : args?.body;
    const normalizedBase = (baseUrl || "").replace(/\/$/, "");
    const normalizedPath = (path || "").startsWith("/")
      ? path
      : `/${path || ""}`;
    const fullUrl = `${normalizedBase}${normalizedPath}`;
    console.log("[RTKQ] Request:", { method, url: fullUrl, body });
    result = await rawBaseQuery(args, apiCtx, extraOptions);
  } catch (e) {
    return {
      error: {
        status: "REQUEST_ERROR",
        data: { message: e?.message || "Request failed" },
      },
    };
  }
  if (
    result?.error &&
    (result.error.status === "PARSING_ERROR" ||
      String(result.error?.error || "").includes("Unexpected token"))
  ) {
    console.error("[RTKQ] Response parsing error:", {
      url: `${(baseUrl || "").replace(/\/$/, "")}${
        (typeof args === "string" ? args : args?.url) || ""
      }`,
      status: result.error.status,
      error: result.error.error,
      data: result.error.data,
    });
    return {
      error: {
        status: result.error.status,
        data: {
          message:
            "Received non-JSON response from server. Check VITE_API_BASE_URL and that the endpoint returns JSON.",
        },
      },
    };
  }
  if (result?.error) {
    console.error("[RTKQ] Response error:", {
      url: `${(baseUrl || "").replace(/\/$/, "")}${
        (typeof args === "string" ? args : args?.url) || ""
      }`,
      status: result.error.status,
      error: result.error.error,
      data: result.error.data,
    });
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithFriendlyErrors,
  tagTypes: ["Products", "Users", "Cart"],
  endpoints: (builder) => ({
    createSellerAccount: builder.mutation({
      query: (formData) => ({
        url: "/accounts/seller",
        method: "POST",
        body: formData, // FormData with personal info, credentials, and file
      }),
      transformResponse: (response) => response?.data || response,
    }),
    deleteAccount: builder.mutation({
      query: (accountId) => ({
        url: `/accounts/${accountId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response?.data || response,
    }),
    getAccountById: builder.query({
      query: (accountId) => ({
        url: `/accounts/${accountId}`,
        method: "GET",
      }),
      transformResponse: (response) =>
        response?.data?.account || response?.account || response,
    }),
    approveSeller: builder.mutation({
      query: ({ sellerId }) => ({
        url: `/accounts/sellers/${sellerId}/approval`,
        method: "PUT",
        body: { status: "approved" },
      }),
      transformResponse: (response) => response?.data || response,
    }),
    rejectSeller: builder.mutation({
      query: ({ sellerId }) => ({
        url: `/accounts/sellers/${sellerId}/approval`,
        method: "PUT",
        body: { status: "rejected" },
      }),
      transformResponse: (response) => response?.data || response,
    }),
    createAdminAccount: builder.mutation({
      query: (payload) => ({
        url: "/accounts/admin",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => response?.data || response,
    }),
    getAccounts: builder.query({
      query: (params) => ({
        url: "/accounts",
        params,
      }),
      transformResponse: (response) => {
        const accounts = response?.data?.accounts ?? [];
        const pagination = response?.data?.pagination ?? null;
        const roleCounts = response?.data?.roleCounts ?? null;
        return { accounts, pagination, roleCounts };
      },
    }),
    getAdminAccounts: builder.query({
      query: (params) => ({
        url: "/accounts",
        params: { role: "admin", ...(params || {}) },
      }),
      transformResponse: (response) => {
        const accounts = response?.data?.accounts ?? [];
        const pagination = response?.data?.pagination ?? null;
        const roleCounts = response?.data?.roleCounts ?? null;
        return { accounts, pagination, roleCounts };
      },
    }),
    getCart: builder.query({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
      transformResponse: (response) => {
        // Expect { success: boolean, data: array, cartTotal: number, itemCount: number, sellerCount: number }
        const rawItems = Array.isArray(response?.data) ? response.data : [];
        const items = rawItems.map((entry) => {
          const item = entry?.item || {};
          return {
            id: entry?.itemId || entry?._id || item?._id || entry?.id,
            name: item?.itemName || item?.name || entry?.name || "",
            price:
              item?.itemPrice != null
                ? Number(item.itemPrice)
                : entry?.price != null
                ? Number(entry.price)
                : 0,
            image: item?.image || entry?.image || "",
            quantity: Number(entry?.quantity) || 1,
            totalPrice:
              entry?.totalPrice != null ? Number(entry.totalPrice) : undefined,
            raw: entry,
          };
        });
        return {
          items,
          cartTotal: Number(response?.cartTotal) || 0,
          itemCount: Number(response?.itemCount) || items.length,
          sellerCount: Number(response?.sellerCount) || 0,
          raw: response,
        };
      },
    }),
    getCartSummary: builder.query({
      query: () => ({
        url: "/cart/summary",
        method: "GET",
      }),
      providesTags: ["Cart"],
      transformResponse: (response) => {
        const data = response?.data || response || {};
        return {
          itemCount: Number(data?.itemCount) || 0,
          sellerCount: Number(data?.sellerCount) || 0,
          cartTotal: Number(data?.cartTotal) || 0,
          formattedTotal: data?.formattedTotal || undefined,
        };
      },
    }),
    addToCart: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: "/cart/add",
        method: "POST",
        body: { itemId, quantity },
      }),
      invalidatesTags: ["Cart"],
      transformResponse: (response) => response?.data || response,
    }),
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `/cart/remove/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
      transformResponse: (response) => response?.data || response,
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
      transformResponse: (response) => response?.data || response,
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/cart/update`,
        method: "PUT",
        body: { itemId, quantity },
      }),
      invalidatesTags: ["Cart"],
      transformResponse: (response) => response?.data || response,
    }),
    getItems: builder.query({
      query: (params) => ({
        url: "/items",
        params,
      }),
      transformResponse: (response) => {
        // Expect { success, data, pagination }
        const items = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        const pagination = response?.pagination || null;
        const categoryTotalItems =
          response?.data?.categoryTotalItems ??
          response?.categoryTotalItems ??
          null;
        return { items, pagination, categoryTotalItems };
      },
    }),
    getSellerItems: builder.query({
      query: (sellerId) => ({
        url: `/items/seller/${sellerId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const items = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        const pagination = response?.pagination || null;
        return { items, pagination };
      },
    }),
    getItemById: builder.query({
      query: (itemId) => `/items/${itemId}`,
      transformResponse: (response) => {
        // Expect { success, data }
        return response?.data || response;
      },
    }),
    getSouvenirs: builder.query({
      query: (params) => ({
        url: "/items",
        params: {
          itemType: "souvenirs",
          ...params,
        },
      }),
      transformResponse: (response) => {
        // Expect { success, data, pagination }
        const items = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        const pagination = response?.pagination || null;
        return { items, pagination };
      },
    }),
    getProducts: builder.query({
      query: () => "/products",
      providesTags: (result) =>
        result?.map?.((p) => ({ type: "Products", id: p.id })) ?? [
          { type: "Products", id: "LIST" },
        ],
    }),
    getSellerReviews: builder.query({
      query: (sellerId) => ({
        url: `/reviews/seller/${sellerId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const raw = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        const reviews = raw.map((r) => ({
          id: r?._id || r?.id,
          reviewerName: r?.buyer || "Anonymous",
          created: (r?.createdAt || "").slice(0, 10),
          text: r?.reviewText || "",
          rating:
            r?.stars != null
              ? Number(r.stars)
              : r?.score != null
              ? Number(r.score)
              : undefined,
          raw: r,
        }));
        const pagination = response?.pagination || null;
        return { reviews, pagination };
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          identifier: credentials?.identifier ?? credentials?.email ?? "",
          password: credentials?.password ?? "",
        },
      }),
    }),
    signup: builder.mutation({
      query: (payload) => ({
        url: "/auth/signup",
        method: "POST",
        body: payload,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (payload) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: payload, // { otp, contactNo }
      }),
    }),
    resendOtp: builder.mutation({
      query: (payload) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: payload, // { contactNo }
      }),
    }),
  }),
});

export const {
  useDeleteAccountMutation,
  useGetAccountByIdQuery,
  useGetAccountsQuery,
  useGetAdminAccountsQuery,
  useCreateSellerAccountMutation,
  useCreateAdminAccountMutation,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useGetCartQuery,
  useGetCartSummaryQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useUpdateCartItemMutation,
  useGetItemsQuery,
  useGetSellerItemsQuery,
  useGetItemByIdQuery,
  useGetSouvenirsQuery,
  useGetProductsQuery,
  useGetSellerReviewsQuery,
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} = api;
