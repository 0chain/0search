package encryption

import (
	"bufio"
	"io"

	"blockworker/core/common"
	"blockworker/core/config"

	"github.com/0chain/gosdk/core/zcncrypto"
)

/*ReadKeys - reads a publicKey and a privateKey from a Reader.
They are assumed to be in two separate lines one followed by the other*/
func ReadKeys(reader io.Reader) (publicKey string, privateKey string) {
	scanner := bufio.NewScanner(reader)
	scanner.Scan()
	publicKey = scanner.Text()
	scanner.Scan()
	privateKey = scanner.Text()
	return publicKey, privateKey
}

//Verify - given a public key and a signature and the hash used to create the signature, verify the signature
func Verify(publicKey string, signature string, hash string) (bool, error) {
	signScheme := zcncrypto.NewSignatureScheme(config.Configuration.SignatureScheme)
	if signScheme != nil {
		err := signScheme.SetPublicKey(publicKey)
		if err != nil {
			return false, err
		}
		return signScheme.Verify(signature, hash)
	}
	return false, common.NewError("invalid_signature_scheme", "Invalid signature scheme. Please check configuration")
}
