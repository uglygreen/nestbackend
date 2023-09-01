import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    _id?: string;
    @Prop({ required: true})
    name: string;
    @Prop({unique: true, required: true})
    email: string;
    @Prop({ minlength: 6, required:true})
    password?: string;
    @Prop({ default: true})
    isActive: boolean;
    @Prop({ type: [String], default: ['USER_ROLE']})
    roles: string[];
    @Prop({ default: 'user_img.jpg'})
    img: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
