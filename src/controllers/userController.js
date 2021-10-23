import userModel from "../model/userModel";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

// Sign Up
export const getSignup = (req, res) => {
  return res.render("users/signup", { pageTitle: "Sign Up" });
};
export const postSignup = async (req, res) => {
  const { username, name, email, password, pwConfirmation, location } =
    req.body;
  const userInfoExists = await userModel.exists({
    $or: [{ username }, { email }],
  });
  const pageTitle = "Sign Up";
  if (password !== pwConfirmation) {
    return res.status(400).render("users/signup", {
      pageTitle,
      errorMessage: "Please check password confirmation again",
    });
  }
  if (userInfoExists) {
    return res.status(400).render("users/signup", {
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
    return res.status(400).render("users/signup", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

// Sign In
export const getSignin = (req, res) => {
  return res.render("users/signin", { pageTitle: "로그인" });
};
export const postSignin = async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username, socialOnly: false });
  if (!user) {
    req.flash("error", "등록되지 않은 계정입니다.");
    return res.status(400).redirect("/signin");
  } else {
    const pwVerification = await bcrypt.compare(password, user.password);
    if (!pwVerification) {
      req.flash("error", "비밀번호가 일치하지 않습니다.");
      return res.status(400).redirect("/signin");
    }
  }
  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};

// Github Sign In
export const startGithubSignin = (req, res) => {
  console.log("깃허브 스타트 시작");
  console.log(process.env.GH_SECRET);
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
  console.log("피니쉬 부분 들어옴");
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
  req.flash("info", "로그아웃 되었습니다.");
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  req.session.loggedIn = false;
  return res.redirect("/");
};

// Profile
export const profile = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id).populate("videos");
  console.log(id);
  if (!user) {
    req.flash("error", "먼저 로그인 하세요.");
    return res.status(404).redirect("/");
  }
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
    id,
  });
};

// Profile Edit
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id: id, avatarUrl },
    },
    body: { newUsername, newEmail, newName, newLocation },
    file,
  } = req;
  const usernameExists = await userModel.exists({ username: newUsername });
  const emailExists = await userModel.exists({ email: newEmail });

  // Edited Username and Email Verification
  if (usernameExists) {
    if (req.session.user.username === newUsername) {
      const updatedUsername = await userModel.findByIdAndUpdate(
        id,
        {
          avatarUrl: file ? file.path : avatarUrl,
          username: newUsername,
          name: newName,
          location: newLocation,
        },
        { new: true }
      );
      req.session.user = updatedUsername;
      req.flash("info", "프로필이 변경되었습니다.");
      return res.redirect(`/users/${id}`);
    }
    req.flash("error", "이미 등록된 이름입니다.");
    return res.status(400).redirect(`/users/${id}`);
  } else if (emailExists) {
    if (req.session.user.email === newEmail) {
      const updatedEmail = await userModel.findByIdAndUpdate(
        id,
        {
          avatarUrl: file ? file.location : avatarUrl,
          email: newEmail,
          name: newName,
          location: newLocation,
        },
        { new: true }
      );
      req.session.user = updatedEmail;
      req.flash("info", "프로필이 변경되었습니다.");
      return res.redirect(`/users/${id}`);
    }
    req.flash("error", "이미 등록된 이메일입니다.");
    return res.sendStatus(400).redirect(`/users/${id}`);
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      username: newUsername,
      email: newEmail,
      name: newName,
      location: newLocation,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  req.flash("info", "프로필이 변경되었습니다.");
  return res.redirect(`/users/${id}`);
};

// Password Change
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "비밀번호를 변경할 수 없습니다.");
    return res.redirect("/");
  }
  return res.render("users/changePassword", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPasswordConfirmation },
    session: {
      user: { _id: id, password: sessionPassword },
    },
  } = req;
  const passwordVerification = await bcrypt.compare(
    oldPassword,
    sessionPassword
  );
  if (!passwordVerification) {
    return res.status(400).render("users/changePassword", {
      pageTitle: "Change Password",
      errorMessage: "Password is not correct.",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/changePassword", {
      pageTitle: "Change Password",
      errorMessage: "Confirmation does not match.",
    });
  }
  const user = await userModel.findById(id);
  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;
  req.flash("info", "비밀번호가 변경되었습니다.");
  return res.redirect("/users/signout");
};

export const remove = async (req, res) => {
  const {
    user: { _id: id },
  } = req.session;
  const user = await userModel.findByIdAndDelete(id);
  console.log(user);
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  req.session.loggedIn = false;
  req.flash("info", "바이바이!");
  return res.redirect("/");
};
