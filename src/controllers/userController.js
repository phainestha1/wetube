

export const login = (req, res) => {
    return res.render("login", {pageTitle: "Log In"});
}

export const signup = (req, res) => {
    return res.render("signup", {pageTitle: "Sign Up"});
}

export const profile = (req, res) => {
    return res.render("profile", {pageTitle : "Profile"});
}