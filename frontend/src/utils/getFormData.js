export default function getFormData(givenFormData=null,defaultFormData){
    if(givenFormData==null) return defaultFormData;
    let formData = {};
    for (let k of Object.keys(defaultFormData)){
        if(!givenFormData.hasOwnProperty(k)) return defaultFormData;
        formData[k] = givenFormData[k];
    }
    return formData;
}