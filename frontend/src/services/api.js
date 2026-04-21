import axios from "axios";

const api = axios.create({
	baseURL: "/api"
});

api.interceptors.request.use((config) => {
	const rawUser = localStorage.getItem("issue-tracker-user");

	if (rawUser) {
		const parsed = JSON.parse(rawUser);
		if (parsed?.token) {
			config.headers.Authorization = `Bearer ${parsed.token}`;
		}
	}

	return config;
});

const authApi = {
	register: (payload) => api.post("/auth/register", payload),
	login: (payload) => api.post("/auth/login", payload)
};

const issueApi = {
	getIssues: (params) => api.get("/issues", { params }),
	getStats: () => api.get("/issues/stats"),
	getIssueById: (id) => api.get(`/issues/${id}`),
	createIssue: (payload) => api.post("/issues", payload),
	updateIssue: (id, payload) => api.put(`/issues/${id}`, payload),
	deleteIssue: (id) => api.delete(`/issues/${id}`),
	updateStatus: (id, status) => api.patch(`/issues/${id}/status`, { status })
};

export { api, authApi, issueApi };
