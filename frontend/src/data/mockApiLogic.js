function makeid(length) {
  let result = '';
  // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characters = '123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function addId(req) {
  if(req.url==="/students"){
    if(!req.body.userId) throw new Error({message: "No userId given for student!"});
    req.body = {id: req.body.userId, ...req.body};
    return;
  }
  const id = req.body.id ?? makeid(5);
  let added = { id };
  if(
    req.url.startsWith("/timetables") || 
    req.url.startsWith("/timeslots") || 
    req.url.startsWith("/managetimetable")
  ) {
    //these don't have xyzId fields
  }
  else if (/^\/[a-zA-Z]+$/.test(req.url)) {
    const key = `${req.url.split("/")[1].replace(/(s|es)$/, "")}Id`;
    added[key] = id;
  } else if (
    !(req.url.startsWith("/marks/") || req.url.startsWith("/managetimetables/"))
  ) {
    return;
  }
  req.body = { ...added, ...req.body };
}

module.exports = (req, res, next) => {
  // console.log(req.url, req.body, req.headers);
  if (!req.url.startsWith("/api")) {
    return res.status(400).send({ message: "Must be a request on /api" });
  }
  req.url = req.url.split("/api")[1];
  if (req.url.startsWith("/auth/login") && req.method === "POST") {
    let { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(401)
        .send({ message: "Username/password cannot be empty" });
    }
    if (password.indexOf("!") !== -1) {
      return res.status(401).send({ message: "Incorrect password" });
    }
    let role = "super_admin";
    if (username.indexOf("admin") !== -1) role = "admin";
    else if (username.indexOf("teacher") !== -1) role = "teacher";
    else if (username.indexOf("student") !== -1) role = "student";
    const userId = ((s)=>(!!Number(s) ? s : '0'))(username.split('#',2)[1]);
    let user = {
      username,
      email: username + "@xyz.com",
      role,
      name: "J Doe",
      userId
    };
    res.set({
      Authorization: "Bearer xyz",
      "Access-Control-Expose-Headers": "*",
    });
    return res.status(200).send({ user });
  }
  if (req.headers["authorization"]?.split("Bearer ")?.[1] == null)
    // mock token auth
    return res
      .status(401)
      .send({ message: "Valid token required for this request" });
  if (req.method === "POST") addId(req);
  if (req.method === "GET" && req.url === "/system") req.url += "/1";
  next();
};
