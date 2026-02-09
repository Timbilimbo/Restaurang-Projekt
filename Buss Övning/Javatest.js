let buss = []
let otherBus = []

// Hållplats 1
buss.push('Agnes','Bengt','Claudia')
console.log('Hållplats 1: ' + buss.join(', '))

// Hållplats 2
buss.push('Daniel','Ester')
console.log('Hållplats 2: ' + buss.join(', '))

// Hållplats 3
let i = buss.indexOf('Agnes')
if(i !== -1) buss.splice(i,1)
buss.push('Fredrik','Gunilla','Hektor')
console.log('Hållplats 3: ' + buss.join(', '))

// Hållplats 4
i = buss.indexOf('Hektor')
if(i !== -1) buss.splice(i,1)
let firstOnes = ['Agnes','Bengt','Claudia']
firstOnes.forEach(name => {
  let index = buss.indexOf(name)
  if(index !== -1) buss.splice(index,1)
})
console.log('Hållplats 4: ' + buss.join(', '))

buss = buss.filter(name => name === 'Ester' || name === 'Gunilla')
buss.push('Johan','Julia','Jonas')
console.log('Hållplats 5: ' + buss.join(', '))

buss = buss.filter(name => !name.toLowerCase().includes('e'))
console.log('Hållplats 6: ' + buss.join(', '))

buss.push('Kjell','Laura','Maurice','Nadia')
console.log('Hållplats 7: ' + buss.join(', '))

buss.unshift('Patricia')
console.log('Hållplats 8: ' + buss.join(', '))

buss = buss.concat(['Laura','Rickard','Timothy'])
console.log('Hållplats 9: ' + buss.join(', '))

console.log('Hållplats 10: ' + buss.join(', '))

let idxK = buss.indexOf('Kjell')
let idxG = buss.indexOf('Gunilla')  
if(idxK !== -1 && idxG !== -1){
  let tmp = buss[idxK]
  buss[idxK] = buss[idxG]
  buss[idxG] = tmp
}
let idxR = buss.indexOf('Rickard')
if(idxR !== -1 && ((idxR + 1) % 2 === 0)){
  buss.splice(idxR,1)
}
console.log('Hållplats 11: ' + buss.join(', '))