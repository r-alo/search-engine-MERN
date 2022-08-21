//Apollo client import
import { gql } from '@apollo/client';

//Get user query
export const GET_ME = gql`
    query me {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                image
                link
                title
                description
            }
        }
    }
`;