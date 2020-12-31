dbPassword = 'mongodb+srv://user01:'+ encodeURIComponent(process.env.DBPass) + '@cluster0.y4l5z.mongodb.net/test?retryWrites=true';
module.exports = {
    mongoURI: dbPassword
};
