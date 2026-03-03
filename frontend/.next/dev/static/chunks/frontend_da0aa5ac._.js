(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/store/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        accessToken: null,
        refreshToken: null,
        user: null,
        isLoading: false,
        isInitialized: false,
        setTokens: (accessToken, refreshToken)=>{
            set({
                accessToken,
                refreshToken
            });
        },
        setUser: (user)=>{
            set({
                user
            });
        },
        setAccessToken: (token)=>{
            set({
                accessToken: token
            });
        },
        logout: ()=>{
            set({
                accessToken: null,
                refreshToken: null,
                user: null
            });
        },
        hydrate: ()=>{
            set({
                isInitialized: true
            });
        }
    }), {
    name: 'auth-storage',
    partialize: (state)=>({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            user: state.user
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authApi",
    ()=>authApi,
    "getApiClient",
    ()=>getApiClient,
    "initializeApiClient",
    ()=>initializeApiClient,
    "projectsApi",
    ()=>projectsApi,
    "tagsApi",
    ()=>tagsApi,
    "todosApi",
    ()=>todosApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/store/auth.ts [app-client] (ecmascript)");
;
;
const API_BASE_URL = 'https://test.api.it911.uz';
let apiClient;
function initializeApiClient() {
    apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log('[v0] API Client initialized with baseURL:', API_BASE_URL);
    // Request interceptor: Add access token to headers
    apiClient.interceptors.request.use({
        "initializeApiClient.use": (config)=>{
            const { accessToken } = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            console.log('[v0] API Request:', config.method?.toUpperCase(), config.url);
            return config;
        }
    }["initializeApiClient.use"], {
        "initializeApiClient.use": (error)=>{
            console.log('[v0] Request interceptor error:', error.message);
            return Promise.reject(error);
        }
    }["initializeApiClient.use"]);
    // Response interceptor: Handle 401 and auto-refresh
    apiClient.interceptors.response.use({
        "initializeApiClient.use": (response)=>{
            console.log('[v0] API Response:', response.status, response.config.url);
            return response;
        }
    }["initializeApiClient.use"], {
        "initializeApiClient.use": async (error)=>{
            console.log('[v0] API Error:', error.message);
            console.log('[v0] Error status:', error.response?.status);
            console.log('[v0] Error data:', error.response?.data);
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const { refreshToken } = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
                    if (!refreshToken) {
                        throw new Error('No refresh token available');
                    }
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/jwt/refresh/`, {
                        refresh: refreshToken
                    });
                    const { access } = response.data;
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].setState({
                        accessToken: access
                    });
                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    console.log('[v0] Token refresh failed:', refreshError);
                    // Refresh failed, clear auth and redirect to login
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].setState({
                        accessToken: null,
                        refreshToken: null,
                        user: null
                    });
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    }["initializeApiClient.use"]);
    return apiClient;
}
function getApiClient() {
    if (!apiClient) {
        initializeApiClient();
    }
    return apiClient;
}
const authApi = {
    login: (credentials)=>getApiClient().post('/api/jwt/create', credentials),
    register: (data)=>getApiClient().post('/api/users/', data),
    refresh: (refreshToken)=>getApiClient().post('/api/jwt/refresh/', {
            refresh: refreshToken
        }),
    me: ()=>getApiClient().get('/api/users/me/')
};
const projectsApi = {
    list: ()=>getApiClient().get('/api/projects/'),
    retrieve: (id)=>getApiClient().get(`/api/projects/${id}/`),
    create: (data)=>getApiClient().post('/api/projects/', data),
    update: (id, data)=>getApiClient().patch(`/api/projects/${id}/`, data),
    delete: (id)=>getApiClient().delete(`/api/projects/${id}/`)
};
const todosApi = {
    listByProject: (projectId)=>getApiClient().get(`/api/todos?project_id=${projectId}/`),
    retrieve: (todoId)=>getApiClient().get(`/api/todos/${todoId}/`),
    create: (projectId, data)=>getApiClient().post(`/api/todos/`, {
            ...data,
            project: projectId
        }),
    update: (todoId, data)=>getApiClient().patch(`/api/todos/${todoId}/`, data),
    delete: (todoId)=>getApiClient().delete(`/api/todos/${todoId}/`)
};
const tagsApi = {
    list: ()=>getApiClient().get('/api/tags/')
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/store/auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10
        }
    }
});
function Providers({ children }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Providers.useEffect": ()=>{
            // Initialize API client and auth store hydration
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApiClient"])();
            // Hydrate the auth store from localStorage
            const state = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
            state.hydrate();
        }
    }["Providers.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/components/providers.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(Providers, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_da0aa5ac._.js.map