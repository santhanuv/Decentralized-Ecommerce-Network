export default function timestampToDate(
  timestamp: string | undefined,
  fromJS = false
) {
  let offset = 1;
  if (!fromJS) offset = 1000;
  if (timestamp) {
    return new Date(Number(timestamp.toString()) * offset);
  }
}
