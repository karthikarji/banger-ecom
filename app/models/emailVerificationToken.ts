import { ObjectId, Document, Schema, Model, model, models } from "mongoose";
const bcrypt = require('bcrypt');

export interface EmailVerificationTokenDocument extends Document {
    user: ObjectId;
    token: String;
    createdAt: Date;
}
interface Methods {
    compareToken(token: string): Promise<boolean>;
}


const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument, {}, Methods>({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now(), expires: 24 * 60 * 60 }
});

emailVerificationTokenSchema.pre('save', async function(next) {
    if (this.isModified('token')) {
      const salt = await bcrypt.genSalt(10);
      this.token = await bcrypt.hash(this.token, salt);
    }
    next();
});
  
emailVerificationTokenSchema.methods.compareToken = async function(candidateToken) {
    try {
        return bcrypt.compare(candidateToken, this.token);
    } catch (error) {
        throw error;
    }
};

const EmailVerificationToken = models.EmailVerificationToken || model('EmailVerificationToken', emailVerificationTokenSchema);

export default EmailVerificationToken as Model <EmailVerificationTokenDocument,  {}, Methods>


/**
 * CHAT GPT Prompt, to auto generate the model
 * 
 * Here is the mongoose model that I want to create
export interface EmailVerificationTokenDocument extends Document {
    user: ObjectId;
    token: String;
    createdAt: Date;
}
this is going to be emailVerificationTokenSchema where I also want to have pre save event where I want to use the hash method from bcrypt to have the token with salt around 10 and also I want to have a compare method extending the methods of emailVerificationTokenSchema which should return the result of compare method of bcrypt. And make sure the token expires in 24hrs
 */

