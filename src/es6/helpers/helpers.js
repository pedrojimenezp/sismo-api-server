'use strict';

export function isEmpty(obj){
  return (Object.getOwnPropertyNames(obj).length === 0);
}
