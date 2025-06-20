import { Types } from 'mongoose';
import { FavoriteType } from '../../schemas/favorite.schema';
export declare class CreateFavoriteDto {
    user: Types.ObjectId;
    type: FavoriteType;
    itemId: Types.ObjectId;
}
