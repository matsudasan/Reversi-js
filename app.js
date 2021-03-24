const table = document.querySelector('table')
const h1 = document.querySelector('h1')
const result = document.getElementById('result')
const path = document.getElementById('path')
const board = []
let turn = "white"
let skip=false

const CreateArray = () => {
    for (let i = 0; i < 8; i++) {
        const row = []
        for (let j = 0; j < 8; j++) {
            row.push('')
        }
        board.push(row)
    }
    board[3][3] = 'white'
    board[3][4] = 'black'
    board[4][3] = 'black'
    board[4][4] = 'white'
}

const CreateTable = () => {
    const player = turn === "white" ? '白' : '黒'
    h1.innerText = `${player}の番です`
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < 8; i++) {
        const tr = document.createElement('tr')
        for (let j = 0; j < 8; j++) {
            const td = document.createElement('td')
            td.style.height = (table.clientWidth - 20) / 8 + 1 + "px" //-20はボーダーの太さ +1とすることで正方形になる
            const span = document.createElement('span')
            if (board[i][j] === 'white') {
                span.classList.add('white')
            } else if (board[i][j] === 'black') {
                span.classList.add('black')
            }
            td.appendChild(span)
            tr.appendChild(td)
            td.addEventListener('click', () => BordClick(i, j))
        }
        fragment.appendChild(tr)
    }
    table.appendChild(fragment)
}

const ReverseArray = (y, x, dy, dx) => {
    let rev = false
    const reverseIndex = []
    while (
        (y + dy >= 0 && y + dy <= 7) &&
        (x + dx >= 0 && x + dx <= 7) &&
        !(board[y + dy][x + dx] === undefined || board[y + dy][x + dx] === '' || board[y + dy][x + dx] === 'move')
    ) {
        y += dy
        x += dx
        if (board[y][x] === turn) {
            rev = true
            break
        }
        reverseIndex.push([y, x])
    }

    if (rev && reverseIndex.length > 0) {
        for (let [y, x] of reverseIndex) {
            board[y][x] = turn
        }
    }
}

const ReverseBord = () => {
    const items = [...document.querySelectorAll('td')]
    let index = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const child = items[index].firstElementChild
            child.classList.remove('black')
            child.classList.remove('white')
            items[index].classList.remove('move')

            if (board[i][j] === 'black') {
                child.classList.add('black')
            } else if (board[i][j] === 'white') {
                child.classList.add('white')
            } else if (board[i][j] === 'move') {
                items[index].classList.add('move')
            }
            index++
        }
    }
}

const CheckBlank = (y = 3, x = 3) => {
    const array = []
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue
            const mx = x + dx
            const my = y + dy

            if ((y + dy >= 0 && y + dy <= 7) && (x + dx >= 0 && x + dx <= 7)) {
                if (board[my][mx] === "") array.push([my, mx, dy, dx])
            }
        }
    }
    return array
}

const CheckMySquare = (y, x, blank, turn) => {
    const move = []
    for (let item of blank) {
        const dy = item[2] * -1
        const dx = item[3] * -1
        let ny = y
        let nx = x
        while (
            (ny + dy >= 0 && ny + dy <= 7) &&
            (nx + dx >= 0 && nx + dx <= 7) &&
            !(board[ny + dy][nx + dx] === undefined || board[ny + dy][nx + dx] === '')
        ) {
            ny += dy
            nx += dx
            if (board[ny][nx] === turn) {
                move.push([item[0], item[1]])
                break
            }
        }
    }
    return move
}


const CheckBord = () => {
    let blank
    const move = []
    let flag = true
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 'white' && turn === 'black') {
                blank = CheckBlank(i, j)
                move.push(...CheckMySquare(i, j, blank, 'black'))
            } else if (board[i][j] === 'black' && turn === 'white') {
                blank = CheckBlank(i, j)
                move.push(...CheckMySquare(i, j, blank, 'white'))
            }
            if (board[i][j] === '') flag = false
        }
    }

    if (move.length === 0) {
        if (flag) {
            Result()
            return
        } else {
            if (AllDelete()) {
                Result('all')
                return
            } else {
                turn = turn === "white" ? 'black' : 'white'
                skip=true
                ClearMove()
                CheckBord()
                return
            }
        }
    } else {
        if(skip){
            let player = turn === "white" ? '黒' : '白'
            path.innerText = `${player}の置き場所がないためパスしました`
            h1.innerText = `${turn === "white" ? '白' : '黒'}の番です`
            skip=false
        }else{
            path.innerText = ''
        }
    }

    for (let [y, x] of move) {
        board[y][x] = 'move'
    }
}

const AllDelete = () => {
    let black = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 'black') black++
        }
    }
    let white = 64 - black

    if (black === 0 || white === 0) {
        return true
    } else {
        return false
    }
}

const Result = (el) => {
    path.innerText = ''
    if(el==='all'){
        let player = turn === "white" ? '黒' : '白'
        result.innerText = `${player}の勝ちです`
        return
    }
    let black = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 'black') black++
        }
    }
    if (black === (64 - black)) {
        result.innerText = `引き分けです`
    } else {
        result.innerText = `${black}対${64 - black}で${player}の勝ちです`
    }

}
const ClearMove = () => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 'move') board[i][j] = ''
        }
    }
}

const BordClick = (y, x) => {
    if (board[y][x] === 'white' || board[y][x] === 'black') return
    const array = JSON.parse(JSON.stringify(board))
    ReverseArray(y, x, -1, 0) //上
    ReverseArray(y, x, -1, 1) //右上
    ReverseArray(y, x, 0, 1) //右
    ReverseArray(y, x, 1, 1) //右下
    ReverseArray(y, x, 1, 0) //下
    ReverseArray(y, x, 1, -1) //左下
    ReverseArray(y, x, 0, -1) //左
    ReverseArray(y, x, -1, -1) //左上

    if (JSON.stringify(board) === JSON.stringify(array)) return
    board[y][x] = turn
    ClearMove()
    turn = turn === "white" ? 'black' : 'white'
    player = turn === "white" ? '白' : '黒'
    h1.innerText = `${player}の番です`
    CheckBord()
    ReverseBord()
}

window.onload = () => {
    CreateArray()
    CheckBord()
    CreateTable()
    ReverseBord()
}