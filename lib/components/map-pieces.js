const guy = '(*)'
const s = '         '
const sc = '   ' + guy + '   '
const f = {e: false}
const intersect = (ra = f, rb = f, rc = f, rd = f) => {
    // return (ra.e || rb.e || rc.e || rd.e ? '+' : ' ')
    const c = (ra.e + rb.e*2 + rc.e*4 + rd.e*8)
    return corners[c]
}
const horiz = (ra = f, rb = f) => {
    let e = 0
    let d = 0
    if(ra.e){
        e += 1
        d += !ra.d.includes('S')
        // return ('━━━' + (ra.d.includes('S') ? '   ' : '━━━') + '━━━')
    }if (rb.e){
        e += 1
        d += 2*(!rb.d.includes('N'))
        // return ('━━━' + (rb.d.includes('N') ? '   ' : '━━━') + '━━━')
    }

    if(e === 1){
        return ('━━━' + (d ? '━━━' : '   ') + '━━━')
    }else if(e === 2){
        return ('━━━' + horiz_doors[d] + '━━━')
    }else{
        return '         '
    }
    
}
const vert = (ra = f, rb = f) => {
    return (ra.e || rb.e ? '┃' : ' ')
}
const vertDoor = (ra = f, rb = f) => {
    let e = 0
    let d = 0
    if(ra.e){
        e += 1
        d += !ra.d.includes('E')
        // return (ra.d.includes('E') ? ' ' : '┃')
    }if(rb.e){
        e += 1
        d += 2*(!rb.d.includes('W'))
        // return (rb.d.includes('W') ? ' ' : '┃')
    }
    
    if(e == 1){
        return (d ? '┃' : ' ')
    }else if(e === 2){
        return vert_doors[d]
    }else{
        return ' '
    }
}

const directionBinary = {
    N: 1,
    E: 2,
    S: 4, 
    W: 8,
}
const paths = {
    0: '   ',
    1: ' ╹ ',
    2: ' ╺═',
    3: ' ╚═',
    4: ' ╻ ',
    5: ' ║ ',
    6: ' ╔═',
    7: ' ╠═',
    8: '═╸ ',
    9: '═╝ ',
    10: '═══',
    11: '═╩═',
    12: '═╗ ',
    13: '═╣ ',
    14: '═╦═',
    15: '═╬═'
}
const corners = {
    0: ' ',
    1: '┛',
    2: '┗',
    3: '┻',
    4: '┏',
    5: '╋',
    6: '┣',
    7: '╋',
    8: '┓',
    9: '┫',
    10: '╋',
    11: '╋',
    12: '┳',
    13: '╋',
    14: '╋',
    15: '╋'
}
const horiz_doors = {
    0: '   ',
    1: '─╥─',
    2: '─╨─',
    3: '━━━'
}
const vert_doors = {
    0: ' ',
    1: '╞',
    2: '╡',
    3: '┃'
}

module.exports = {
    s,
    sc,
    f,
    guy,
    intersect,
    horiz,
    vert,
    vertDoor,
    directionBinary,
    paths
}