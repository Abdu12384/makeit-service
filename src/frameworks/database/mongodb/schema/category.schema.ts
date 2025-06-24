import { Schema } from 'mongoose'
import { ICategoryModel } from '../model/category.model'

export const categorySchema = new Schema<ICategoryModel>({
    categoryId: {
        type: String,
        required: true
    },
    description: { 
      type: String, 
      required: true
     },

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
        
    },
    title: {
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    }
},
    {
        timestamps: true
    })
