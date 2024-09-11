import {Entity, model, property} from '@loopback/repository';

@model()
export class CategoryUpdate extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
        required: true
        })
        id: number;

    @property({
        type: 'string',
    })
    name?: string;

    @property({
        type: 'string'
    })
    description?: string;

    constructor(data?: Partial<CategoryUpdate>) {
        super(data);
    }
}