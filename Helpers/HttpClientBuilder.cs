using System.Net.Http;
using System;

namespace OrsaDemoWebApp.Helpers
{
    public class HttpClientBuilder
    {
        public HttpClient httpbuilder(HttpClient httpClient)
        {
            var handler = new HttpClientHandler();    // Create an instance of the HttpClientHandler class to handle
            handler.ClientCertificateOptions = ClientCertificateOption.Manual;    // Set certificate options      
            handler.ServerCertificateCustomValidationCallback =
                (httpRequestMessage, cert, certChain, policyErrors) => true;    // Set certificate validations
            httpClient = new HttpClient(handler);    // Get handler to HttpClient
            httpClient.BaseAddress = new Uri("https://localhost:44313/");    // Set the base address
            
            return httpClient;
        }

    }

}