let obj = JSON.parse($response.body);
obj.license.status = 'sub';
obj.license.expireTime = 0x201a9c800000;
$done({ body: JSON.stringify(obj) });