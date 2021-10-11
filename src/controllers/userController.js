import userModel from "../model/userModel";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

// Sign Up
export const getSignup = (req, res) => {
  return res.render("signup", { pageTitle: "Sign Up" });
};
export const postSignup = async (req, res) => {
  const { username, name, email, password, pwConfirmation, location } =
    req.body;
  const userInfoExists = await userModel.exists({
    $or: [{ username }, { email }],
  });
  const pageTitle = "Sign Up";
  if (password !== pwConfirmation) {
    return res.status(400).render("signup", {
      pageTitle,
      errorMessage: "Please check password confirmation again",
    });
  }
  if (userInfoExists) {
    return res.status(400).render("signup", {
      pageTitle,
      errorMessage: "This username / E-mail is already taken.",
    });
  }
  try {
    await userModel.create({
      username,
      name,
      email,
      password,
      location,
    });
    return res.redirect("/signin");
  } catch (error) {
    return res.status(400).render("signup", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

// Sign In
export const getSignin = (req, res) => {
  return res.render("signin", { pageTitle: "Sign In" });
};
export const postSignin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Sign In";
  const user = await userModel.findOne({ username, socialOnly: false });
  const pwVerification = await bcrypt.compare(password, user.password);

  if (!user) {
    return res.status(400).render("/signin", {
      pageTitle,
      errorMessage: "Username does not exists.",
    });
  }

  if (!pwVerification) {
    return res.status(400).render("/signin", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  console.log(req.session.user);
  res.redirect("/");
};

// Github Sign In
export const startGithubSignin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubSignin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await userModel.findOne({ email: emailObj.email });
    if (!user) {
      user = await userModel.create({
        avatarUrl: userData.avatar_url,
        username: userData.login,
        name: userData.name,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/signin");
  }
};

// Sign Out
export const signout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

// Profile
export const profile = (req, res) => {
  return res.render("profile", { pageTitle: "Profile" });
};
export const see = (req, res) => {};

export const getEdit = (req, res) => {
  return res.render("editProfile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { newUsername, newEmail, newName, newLocation },
  } = req;
  const usernameExists = await userModel.exists({ username: newUsername });
  const emailExists = await userModel.exists({ email: newEmail });

  // Edited Username and Email Verification
  if (usernameExists) {
    if (req.session.user.username === newUsername) {
      const updatedUsername = await userModel.findByIdAndUpdate(
        _id,
        {
          username: newUsername,
          name: newName,
          location: newLocation,
        },
        { new: true }
      );
      req.session.user = updatedUsername;
      return res.render("editProfile", {
        pageTitle: "Edit Profile",
        errorMessage: "Username was updated.",
      });
    }
    return res.status(400).render("editProfile", {
      pageTitle: "Edit Profile",
      errorMessage: "Username is already taken",
    });
  } else if (emailExists) {
    if (req.session.user.email === newEmail) {
      const updatedEmail = await userModel.findByIdAndUpdate(
        _id,
        {
          email: newEmail,
          name: newName,
          location: newLocation,
        },
        { new: true }
      );
      req.session.user = updatedEmail;
      return res.render("editProfile", {
        pageTitle: "Edit Profile",
        errorMessage: "Email was updated.",
      });
    }
    return res.status(400).render("editProfile", {
      pageTitle: "Edit Profile",
      errorMessage: "Email is already taken",
    });
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    _id,
    {
      username: newUsername,
      email: newEmail,
      name: newName,
      location: newLocation,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.render("editProfile", {
    pageTitle: "Edit Profile",
    errorMessage: "Profile updated",
  });
};

export const remove = (req, res) => {};
