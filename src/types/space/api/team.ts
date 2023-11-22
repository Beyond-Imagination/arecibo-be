export interface Profile {
    id: string
    username: string
    name: {
        firstName: string
        lastName: string
    }
    smallAvatar: string
    avatar: string
    profilePicture: string
}
