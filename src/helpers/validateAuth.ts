export default async function (email, password, request) {
    const user = await this.db.models.User.findOne({ email });
    this.assert(password != null, 401);

    const valid = await user.comparePassword(password);

    this.assert(valid, 401);

    request.headers['x-email'] = email;
}