import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Category_TestDB } from "../entity/Category"

export class CategoryController {

    private CategoryRepository = AppDataSource.getRepository(Category_TestDB)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.CategoryRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/category", "");

        if(url == ""){
            return this.CategoryRepository.find()
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return "Invalid URL"
        }
        const C_Id = parseInt(urlParams.get("id"));


        const Category = await this.CategoryRepository.findOne({
            where: { C_Id }
        })

        if (!Category) {
            return "unregistered Category"
        }
        return Category
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { Label, Order, Is_Active } = request.body;

        const category = Object.assign(new Category_TestDB(), {
            Label,
            Order,
            Is_Active
        })

        return this.CategoryRepository.save(category)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const C_Id = parseInt(request.params.id)

        let CategoryToRemove = await this.CategoryRepository.findOneBy({ C_Id })

        if (!CategoryToRemove) {
            return "this Category not exist"
        }

        await this.CategoryRepository.remove(CategoryToRemove)

        return "Category has been removed"
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { C_Id, Label, Order, Is_Active } = request.body;

        const category = Object.assign(new Category_TestDB(), {
            C_Id,
            Label,
            Order,
            Is_Active
        })

        return await this.CategoryRepository.update(parseInt(category.C_Id), category)
    }

    async create_update(request: Request, response: Response, next: NextFunction) {
        const { C_Id, Label, Order, Is_Active } = request.body;
        const CategoryToUpdate = await this.CategoryRepository.findOneBy({ C_Id })
        const category = Object.assign(new Category_TestDB(), {
            C_Id,
            Label,
            Order,
            Is_Active
        })

        if (!CategoryToUpdate) {
            return this.CategoryRepository.save(category)
        }
        
        return await this.CategoryRepository.update(parseInt(category.C_Id), category)
    }

}