import {getStorage} from 'firebase-admin/storage';
import {initializeApp, cert} from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

// please work

initializeApp({
    credential: cert({
        "type": "service_account",
        "project_id": "plixx-trailer",
        "private_key_id": "cd5a51e9a096bbca64764e90866bf45c43dfa72b",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHyh5p/H1IclH4\n1XVUrLrNSHO6za9vrP4tKZfqN3ZQqc5aMjDe4P4pDU6cFL681s8asJH/E7OpxDCj\nwAuXkHXrX1JqpeBYLk1thrdFh5viEBPoZXQ53t9k+6SQtw2ummmyTGx8ZfDAYrZ2\n8rRtfjsW0cLllyUJgmyQ/83G+5EV5S5k/hJiAsebjpZC6nqY3alwOKXkqeKhFixT\n3gSsQmkAjjTdpnfuJNsUsbM8u+r+MSeDVTdojmvQojGotJJ42g+IuJCtNMEQiz8h\nlHLwuamRNUmjbwpnTWoO6TIa7EkcpKA9i/C+ypuqUViTGJ88M6lveUDU73ziHNke\nFDO+gHLdAgMBAAECggEAEhfEv1ZlRh1MPRufn4Zw+Ew6Zs1fuN5SumZM4qIZLd7i\n2Bo5gMWhXrhcyRe72kAdy034OsBfAd3JhdrLcfNcKm+ceBoDghjXXDbZ/Ar22/cW\nxnIBn4gGdQ+w7IYXUBudvM7c+DsHHXUTDxyVqGDJGxzt6HrSmNTd3he8W+vGTNQm\nZIH1/XmrnqxuACSnPeqFeEa4CjGoU2pMmBUWL5BJOlfixoDfAP/6IVjBCdnb5t2j\nE6S93C7Vu95570S1KlJZe0oaR6dMk8RnEIwgOp2v+OrgA4x4pPeHk/a9pIgWHch2\nRBPJm5pJrjRvZ2TcTIdkarE/cu8+g4COoIl+3L+BxQKBgQDu5fPTai2bI3vMFEh+\nwkP2AaE2Ey2WYAGFhm4BcQSUoOtH5y9RJ302F15SF72bqyvS515VrwqyvL97hXb1\njnVrveHE6PQvVqikq8frWYXnPJH/NF6pr6CrIWffELe3TXXrfBZXvRLJhPxTHUgs\nBMQaYt93047sQtepcOBS3RFxzwKBgQDWF3XM8j1sozSI2kcVenn7FhKSEgbocGov\nkFScakfCZxf8blmVNFhm3NnPtr9YTttSDV8SVwJ/SnvuhlW0xHTHyBiuGdkfw2ss\nNkEhX9JhYe4AcNrMDxmMnL6iexk84lojzWe43ameGuOCeELw2VSwTUXiMA+2ax5G\nGidaNLWXkwKBgQDhJ9soy26WQ9genJNC3Mb+qcSN2X9itbNZbDxroWAG0K9PQkVn\nQEeTXmzoBDYQ7D/Oc3+GVAZKNPhna3+VqaFjXT/WvRO/NfaV1M0ENIiuSnjzRSFe\n3gcYotBp/TCZUykrOvU31hxJz8ucbgGicw98Kumg3sRaShlGOftCPdZ+IwKBgHXX\nOe8SEv8+IgeF5gSLgqLS9mvSYl0Eq1382qWx1kfKCSjX8JUw18vemkE7vLy1wwC5\n/W+R1v0LmYWkCX7Td9gTaopCDgHuxYnzXwwouxsBFUjG1ZfmY9DC4id7DFw31xfH\n0uStldRBxqKk4WvCpFvaXLHwdGWbNnGtqaV8R8vjAoGADh9orInK6JJMpE4v0Vcf\nVgZg9DHH4J06nfjYGM0n8LfwNcBmC2MMVhYKdf/K/c3eCp6/evzAjWWLsciEba7X\nwGjxbPkvjTwTE/ITR+nah84p1FR1JFCF+4/a+Abe/qr+gawQfHOONU1vx/Ivqqzn\nY8vpziE+ECyOYm4RHd/W330=\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-4d0wv@plixx-trailer.iam.gserviceaccount.com",
        "client_id": "101827228000896437498",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4d0wv%40plixx-trailer.iam.gserviceaccount.com"
      }),
    
    storageBucket: process.env.STORAGE_BUCKET,
});

const trailerStorage = getStorage().bucket();

export default trailerStorage;
    