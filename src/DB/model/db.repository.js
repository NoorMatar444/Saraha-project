export async function findOne({
    model,
    filter,
    select,
    populate=false,
    populateField=""
}){
    let result;
    if(populate){
        result= await model.findOne(filter).select(select).populate(populateField)
    }else{
        result= await model.findOne(filter).select(select)
    }
    return result;
}

export async function create({
    model,
    insertedData,
    option={}
}){
    const [result]= await model.create([insertedData],option)
    return result;
}

export async function findById({
    model,
    id,
    select,
    populate=false,
    populateField=""
}){
    let result;
    if(populate){
        result= await model.findById(id).select(select).populate(populateField)
    }else{
        result= await model.findById(id).select(select)
    }
    return result;
}

export async function updateOne({model,filter,data,options}){
    const result=await model.updateOne(filter,data,options)
    return result;
}