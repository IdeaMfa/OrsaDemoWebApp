using Newtonsoft.Json;
using OrsaDemoModels.Entity;
using OrsaDemoModels.Entity.VmModel;
using OrsaDemoWebApp.Helpers;
using OrsaDemoWebApp.Models.Interface;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace OrsaDemoWebApp.Service
{
    public class ListPersonnelsService : IListPersonnelsService
    {

        private readonly HttpClient _httpClient;    // Create an HttpClient object

        public ListPersonnelsService(HttpClient httpClient)
        {
            var getHttp = new HttpClientBuilder();
            _httpClient = getHttp.httpbuilder(httpClient);
        }

        public async Task<List<vmListPersonnel>> ListPersonnels()
        {
            var response = await _httpClient.GetAsync($"api/ListPersonnels/ListPersonnels");

            if (response.IsSuccessStatusCode)
            {

                var responseData = await response.Content.ReadAsStringAsync();    // Get response data as a string
                var result = JsonConvert.DeserializeObject<List<vmListPersonnel>>(responseData);    // Convert response data to Personnels from JSON format
                
                return result;

            }
            else
            {

                return null;

            }

        }

    }

}
