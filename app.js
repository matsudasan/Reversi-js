const table = document.querySelector('table')
const h1 = document.querySelector('h1')
const board = []
let turn = "white"

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
    h1.innerText = `${turn}の番です`
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
        !(board[y + dy][x + dx] === undefined || board[y + dy][x + dx] === '')
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

            if (board[i][j] === 'black') {
                child.classList.add('black')
            } else if (board[i][j] === 'white') {
                child.classList.add('white')
            } [
                index++
            ]
        }
    }
    turn = turn === "white" ? 'black' : 'white'
    h1.innerText = `${turn}の番です`
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
    console.log(y, x, blank)
    const move = []
    for (let item of blank) {
        const dy = item[2] * -1
        const dx = item[3] * -1
        if (board[y + dy][x + dx] === '') continue
        if (board[y + dy][x + dx] === turn) move.push([item[0], item[1]])
        console.log(item[0], item[1], y + dy, x + dx)
    }
    return move
}


const CheckBord = () => {
    const help = []
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 'white' && turn === 'black') {
                const blank = CheckBlank(i, j)
                const move = CheckMySquare(i, j, blank, 'black')
            } else if (board[i][j] === 'black' && turn === 'white') {
                const blank = CheckBlank(i, j)
                const move = CheckMySquare(i, j, blank, 'white')
            }
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
    ReverseBord()
}

window.onload = () => {
    CreateArray()
    CheckBord()
    CreateTable()
}