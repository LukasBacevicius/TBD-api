export default async (email, password, request, reply) => {
    const user = this.db.models.User.findOne({ email });

    this.assert(password != null, 401);

    const validPassword = this.bcrypt.compare(password, user.password);
    this.assert(validPassword, 401);

    request.headers['x-email'] = email;
}