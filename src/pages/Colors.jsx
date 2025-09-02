const Colors = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4 font-display">
            Coast2Cart Design System
          </h1>
          <p className="text-xl text-base-content/70 font-primary">
            Custom theme colors and usage examples
          </p>
        </div>

        {/* Usage Guidelines */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-base-content mb-6 font-display">
            Usage Guidelines
          </h2>
          <div className="bg-base-100 rounded-lg p-8 shadow-md">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-base-content mb-3 font-display">
                  How to use the colors naming in tailwind classes. Also refer
                  to this link{" "}
                  <a
                    href=" https://daisyui.com/docs/colors/"
                    className="text-primary underline"
                  >
                    daisyUI Color Classes
                  </a>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-base-content mb-2">
                      Background Colors:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded border border-base-300"></div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          bg-primary
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded border border-base-300"></div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          bg-secondary
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent rounded border border-base-300"></div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          bg-accent
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral rounded border border-base-300"></div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          bg-neutral
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-100 rounded border border-base-300"></div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          bg-base-100
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-200 rounded border border-base-300"></div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          bg-base-200
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-300 rounded border border-base-300"></div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          bg-base-300
                        </code>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content mb-2">
                      Text Colors:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-200 rounded flex items-center justify-center">
                          <span className="text-primary text-xs font-bold">
                            Aa
                          </span>
                        </div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          text-primary
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                          <span className="text-primary-content text-xs font-bold">
                            Aa
                          </span>
                        </div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          text-primary-content
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-200 rounded flex items-center justify-center">
                          <span className="text-secondary text-xs font-bold">
                            Aa
                          </span>
                        </div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          text-secondary
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
                          <span className="text-secondary-content text-xs font-bold">
                            Aa
                          </span>
                        </div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          text-secondary-content
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-200 rounded flex items-center justify-center">
                          <span className="text-accent text-xs font-bold">
                            Aa
                          </span>
                        </div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          text-accent
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                          <span className="text-accent-content text-xs font-bold">
                            Aa
                          </span>
                        </div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          text-accent-content
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-200 rounded flex items-center justify-center">
                          <span className="text-base-content text-xs font-bold">
                            Aa
                          </span>
                        </div>
                        <code className="bg-base-200 px-2 py-1 rounded text-sm">
                          text-base-content
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-base-content mb-6 font-display">
            Color Palette
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <div className="w-full h-20 bg-primary rounded-lg mb-4"></div>
              <h3 className="font-semibold text-base-content mb-2">Primary</h3>
              <p className="text-sm text-base-content/70">#012466</p>
            </div>

            {/* Secondary */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <div className="w-full h-20 bg-secondary rounded-lg mb-4"></div>
              <h3 className="font-semibold text-base-content mb-2">
                Secondary
              </h3>
              <p className="text-sm text-base-content/70">#fdb815</p>
            </div>

            {/* Accent */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <div className="w-full h-20 bg-accent rounded-lg mb-4"></div>
              <h3 className="font-semibold text-base-content mb-2">Accent</h3>
              <p className="text-sm text-base-content/70">#f04c05</p>
            </div>

            {/* Neutral */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <div className="w-full h-20 bg-neutral rounded-lg mb-4"></div>
              <h3 className="font-semibold text-base-content mb-2">Neutral</h3>
              <p className="text-sm text-base-content/70">#d9d9d9</p>
            </div>
          </div>
        </div>

        {/* Base Colors */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-base-content mb-6 font-display">
            Base Colors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-base-100 rounded-lg p-6 shadow-md border border-base-300">
              <div className="w-full h-16 bg-base-100 rounded-lg mb-4 border border-base-300"></div>
              <h3 className="font-semibold text-base-content mb-2">Base-100</h3>
              <p className="text-sm text-base-content/70">#e2e8f0</p>
            </div>

            <div className="bg-base-100 rounded-lg p-6 shadow-md border border-base-300">
              <div className="w-full h-16 bg-base-200 rounded-lg mb-4 border border-base-300"></div>
              <h3 className="font-semibold text-base-content mb-2">Base-200</h3>
              <p className="text-sm text-base-content/70">#ffffff</p>
            </div>

            <div className="bg-base-100 rounded-lg p-6 shadow-md border border-base-300">
              <div className="w-full h-16 bg-base-300 rounded-lg mb-4 border border-base-300"></div>
              <h3 className="font-semibold text-base-content mb-2">Base-300</h3>
              <p className="text-sm text-base-content/70">#ffffff</p>
            </div>
          </div>
        </div>

        {/* Semantic Colors */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-base-content mb-6 font-display">
            Semantic Colors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <div className="w-full h-16 bg-info rounded-lg mb-4"></div>
              <h3 className="font-semibold text-base-content mb-2">Info</h3>
              <p className="text-sm text-base-content/70">#0ea5e9</p>
            </div>

            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <div className="w-full h-16 bg-success rounded-lg mb-4"></div>
              <h3 className="font-semibold text-base-content mb-2">Success</h3>
              <p className="text-sm text-base-content/70">#10b981</p>
            </div>

            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <div className="w-full h-16 bg-warning rounded-lg mb-4"></div>
              <h3 className="font-semibold text-base-content mb-2">Warning</h3>
              <p className="text-sm text-base-content/70">#f59e0b</p>
            </div>

            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <div className="w-full h-16 bg-error rounded-lg mb-4"></div>
              <h3 className="font-semibold text-base-content mb-2">Error</h3>
              <p className="text-sm text-base-content/70">#ef4444</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Colors;
