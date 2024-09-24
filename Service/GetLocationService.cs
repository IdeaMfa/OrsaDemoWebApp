using Newtonsoft.Json;
using OrsaDemoModels.Entity;
using OrsaDemoWebApp.Helpers;
using OrsaDemoWebApp.Models.Interface;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace OrsaDemoWebApp.Service
{
    public class GetLocationService : IGeograpyService
    {

        private readonly HttpClient _httpClient = new HttpClient();
        public GetLocationService(HttpClient httpClient)
        {

            var getHttp = new HttpClientBuilder();
            _httpClient = getHttp.httpbuilder(httpClient);

        }

        public async Task<List<Geography>> GetLocation(int ParentId)
        {
            var response = await _httpClient.GetAsync($"api/GetLocation/GetLocation/{ParentId}");

            if (response.IsSuccessStatusCode)
            {

                var responsedata = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<List<Geography>>(responsedata);

                return result;

            }
            else
            {

                return null;

            }
        }

        public async Task<List<Geography>> GetAllLocations()
        {
            var response = await _httpClient.GetAsync($"api/GetLocation/GetAllLocations");

            if (response.IsSuccessStatusCode)
            {

                var responsedata = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<List<Geography>>(responsedata);
                
                return result;

            }
            else
            {

                return null;

            }
        }

    }
}
