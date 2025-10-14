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
      transformResponse: (response) => {
        const a =
          response?.data?.account || response?.account || response || {};
        const firstName = a?.firstName || "";
        const lastName = a?.lastName || "";
        const fullName = [firstName, lastName].filter(Boolean).join(" ");
        return {
          id: a?.id || a?._id,
          firstName,
          lastName,
          fullName,
          username: a?.username || "",
          email: a?.email || "",
          contactNo: a?.contactNo || a?.phoneNumber || "",
          address: a?.address || "",
          dateOfBirth: a?.dateOfBirth || undefined,
          role: a?.role || "",
          isVerified: Boolean(a?.isVerified),
          createdAt: a?.createdAt || undefined,
          memberSinceYear: a?.createdAt
            ? new Date(a.createdAt).getFullYear()
            : undefined,
          raw: a,
        };
      },
    }),
    getSellerInfo: builder.query({
      query: (sellerId) => ({
        url: `/accounts/sellers/${sellerId}/info`,
        method: "GET",
      }),
      transformResponse: (response) => {
        // Expect { success: true, data: { seller: { name, location, phoneNumber, createdAt, email, image } } }
        const s = response?.data?.seller || response?.seller || {};
        return {
          name: s?.name || "",
          location: s?.location || "",
          phoneNumber: s?.phoneNumber || s?.phone || "",
          email: s?.email || "",
          createdAt: s?.createdAt || undefined,
          image: s?.image || null,
          raw: s,
        };
      },
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
    createItem: builder.mutation({
      query: (payload) => {
        // payload may contain File for image; use FormData
        const form = new FormData();
        const entries = Object.entries(payload || {});
        for (const [key, value] of entries) {
          if (value == null) continue;
          form.append(key, value);
        }
        return {
          url: "/items",
          method: "POST",
          body: form,
        };
      },
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
    getSellerSoldItems: builder.query({
      query: (sellerId) => ({
        url: `/items/sold/seller/${sellerId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        // Accept flexible server shapes
        const raw = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
          ? response
          : [];
        const items = raw.map((r) => {
          const item = r?.item || r?.product || r;
          const id = r?._id || r?.id || item?._id || item?.id;
          const name = item?.itemName || item?.name || r?.name || "";
          const image = item?.image || item?.imageUrl || r?.image || "";
          const category =
            item?.category || item?.itemType || r?.category || "";
          const qty = r?.quantity ?? r?.qty ?? item?.quantity ?? undefined;
          const unit = item?.unit || r?.unit || "";
          const quantity =
            qty != null
              ? `${qty} ${unit || ""}`.trim()
              : r?.weight || r?.quantityLabel || "";
          const soldDate =
            r?.soldAt || r?.createdAt || r?.updatedAt || item?.soldAt || "";
          return { id, name, image, category, quantity, soldDate, raw: r };
        });
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
  useGetAccountsQuery,
  useGetAdminAccountsQuery,
  useCreateAdminAccountMutation,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useGetCartQuery,
  useGetCartSummaryQuery,
  useAddToCartMutation,
  useCreateItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useUpdateCartItemMutation,
  useGetItemsQuery,
  useGetSellerItemsQuery,
  useGetSellerSoldItemsQuery,
  useGetItemByIdQuery,
  useGetSouvenirsQuery,
  useGetProductsQuery,
  useGetSellerReviewsQuery,
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} = api;
