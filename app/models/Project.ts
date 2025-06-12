import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    ProjectName: {
        type: String,
        required: false
    },
    category: {
        type: String,
        default: 'Project'
    },
    desc: {
        type: String,
        required: false
    },
    Description: {
        type: String,
        required: false
    },
    attachmentCount: {
        type: Number,
        default: 0
    },
    totalTask: {
        type: Number,
        default: 0
    },
    completedTask: {
        type: Number,
        default: 0
    },
    progression: {
        type: Number,
        default: 0
    },
    dayleft: {
        type: Number,
        default: 30
    },
    favourite: {
        type: Boolean,
        default: false
    },
    member: [{
        id: String,
        name: String,
        img: String
    }]
}, {
    timestamps: true
});

// Pre-save middleware to ensure consistent field names
projectSchema.pre('save', function(next) {
    // If ProjectName is set but name isn't, use ProjectName for name
    if (this.ProjectName && !this.name) {
        this.name = this.ProjectName;
    }
    // If Description is set but desc isn't, use Description for desc
    if (this.Description && !this.desc) {
        this.desc = this.Description;
    }
    next();
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project; 