export interface IWorkSampleEntity {
     workSampleId: string;
     title: string;
     description: string;
     images: string[];
     vendorId: string;
     createdAt?: Date;
     updatedAt?: Date;
}