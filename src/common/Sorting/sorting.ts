export const handleSortData = (data:any) =>{
    if(data){
    const newData = [...data];
    const reversData = newData.reverse();
    return reversData;
    }
}
