const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    COMUNITY: "/community",
    COLLECTION: "/collection",
    JOBS: "/find-jobs",
    TAGS: (id: string) => `/tags/${id}`,
    PROFILE: "/profile",
    ASK_QUESTION: (id: string) => `/ask-a-question/${id}`,
};

export default ROUTES;