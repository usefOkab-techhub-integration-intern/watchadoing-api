function removeAttr(obj: any, attributes: string[]): any {
    const trimmedObj = { ...obj };
    attributes.forEach(attr => {
      if (attr in trimmedObj) {
        delete trimmedObj[attr];
      }
    });
    return trimmedObj;
  }

export function removeAttrArray(objArr: any[], attributes: string[]): any[] {
    return objArr.map(item => removeAttr(item, attributes));
  }