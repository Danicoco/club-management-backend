const validateUser = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    if(first_name === "" || !first_name)
        return res.status(400).json({ status: 400, message: "Please enter your First Name" });
    if(last_name === "" || !last_name)
        return res.status(400).json({ status: 400, message: "Please enter your Last Name" });
    if(email === "" || !email)
        return res.status(400).json({ status: 400, message: "Please enter your email" });
    if (regex.test((email).toLocaleLowerCase()) === false)
        return res.status(400).json({ status: 400, message: "Please enter a valid email" });
    if(password === "" || !password)
        return res.status(400).json({ status: 400, message: "Please enter your password" });
    if(password.length < 6)
        return res.status(400).json({ status: 400, message: "Your password must be 6+ characters" });
    //if all validation passed, return next
    return next();
}

module.exports = {
    validateUser
}