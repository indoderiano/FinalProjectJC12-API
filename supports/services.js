
const titleConstruct=(string)=>{
    string=string.split(' ')

    var newstring = string.map((val,index)=>{
        var newcase=val.charAt(0).toUpperCase()+val.slice(1)
        // console.log(newcase)

        return newcase
    })

    newstring=newstring.join(' ')
    console.log(newstring)
    return newstring
}

// titleConstruct('hello kitty')


// const number=Math.ceil(2.4)

// console.log(number)


Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

var time=new Date().addHours(4)


console.log(new Date())
console.log(time)