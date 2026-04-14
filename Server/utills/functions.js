export function generateRoomId(userid1, userid2) {
    return [userid1, userid2].sort().join('_');
}