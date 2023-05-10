export default function getStringSpace(string: string, STR_PREFIX?: number) {

const STRING_LENGTH_PREFIX = 4;
    return string.length * 4 + (STR_PREFIX ? STR_PREFIX : STRING_LENGTH_PREFIX); 
};