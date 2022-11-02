import { ServerOptions } from 'https';

export const isHttpsServerOptions = (arg): arg is ServerOptions => {
  return (
    arg.ca ||
    arg.cert ||
    arg.sigalgs ||
    arg.ciphers ||
    arg.clientCertEngine ||
    arg.crl ||
    arg.dhparam ||
    arg.ecdhCurve ||
    arg.key ||
    arg.privateKeyEngine ||
    arg.privateKeyIdentifier ||
    arg.maxVersion ||
    arg.minVersion ||
    arg.passphrase ||
    arg.pfx ||
    arg.secureOptions ||
    arg.secureProtocol ||
    arg.sessionIdContext ||
    arg.secureContext ||
    arg.ALPNProtocols ||
    arg.SNICallback ||
    arg.handshakeTimeout ||
    arg.sessionTimeout ||
    arg.ticketKeys
  );
};
