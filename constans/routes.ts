const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    COMUNITY: "/community",
    COLLECTION: "/collection",
    JOBS: "/find-jobs",
    TAGS: "/tags",
    TAG: (id: string) => `/tags/${id}`,
    PROFILE: (id: string) => `/profile/${id}`,
    QUESTION: (id: string) => `/question/${id}`,
    EDIT_QUESTION: (id: string) => `/question/${id}/edit`,
    ASK_QUESTION: "/ask-a-question",
    SIGN_IN_WITH_OAUTH: "signin-with-oauth"
};

export default ROUTES;