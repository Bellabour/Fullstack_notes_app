export interface Note {
    _id: string;
    title: string;
    text?: string;
    folders?: string[];
    tags?: string[];
    categories?: CategoryModel[];
    createdAt: string;
    updatedAt: string;
}
export interface FolderModel {
    _id: string;
    name: string;
    // Other folder-related fields if needed
}

export interface TagModel {
    _id: string;
    name: string;
    // Other tag-related fields if needed
}

export interface CategoryModel {
    _id: string;
    name: string;
    // Other category-related fields if needed
}
