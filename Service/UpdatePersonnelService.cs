using Microsoft.IdentityModel.Tokens;
using OrsaDemoModels.Entity;
using OrsaDemoWebApp.Models.Interface;
using System.Net.Http;
using System.Threading.Tasks;
using OrsaDemoWebApp.Helpers;
using Newtonsoft.Json;
using System.Text;
using System;
using System.IO;
using OrsaDemoModels.Entity.VmModel;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace OrsaDemoWebApp.Service
{
    public class UpdatePersonnelService : IUpdatePersonnelService
    {

        private readonly HttpClient _httpClient = new HttpClient();
        public UpdatePersonnelService(HttpClient httpClient)
        {

            var getHttp = new HttpClientBuilder();
            _httpClient = getHttp.httpbuilder(httpClient);

        }

        public async Task<vmListPersonnel> EditPersonnelGetData(int Id)
        {
            var response = await _httpClient.GetAsync($"api/UpdatePersonnel/UpdatePersonnelGetData/{Id}");

            if (response.IsSuccessStatusCode)
            {

                var responsedata = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<vmListPersonnel>(responsedata);

                return result;

            }
            else
            {

                return null;

            }
        }

        public async Task<Personnels> EditPersonnelPutData(Personnels personnels)
        {
            try
            {
                var jsonData = JsonConvert.SerializeObject(personnels);    // Convert the data into json format
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");    // Make JSON formated data a string to use in code
                var response = await _httpClient.PutAsync($"api/UpdatePersonnel/UpdatePersonnelPutData", content); // Give the content to API via Http Client


                if (response.IsSuccessStatusCode)
                {

                    var responseData = await response.Content.ReadAsStringAsync();    // Get response data as a string
                    var result = JsonConvert.DeserializeObject<Personnels>(responseData);    // Convert response data to Personnels from JSON format
                    return result;

                }
                else
                {

                    return null;

                }
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }


        public async Task<Personnels> DeletePersonnel(Personnels personnels)
        {

            throw new System.NotImplementedException();

        }

        public async Task<bool> DeletePersonnelPhotos(List<int> Ids)
        {
            var jsonData = JsonConvert.SerializeObject(Ids);
            var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/UpdatePersonnel/DeletePersonnelPhotos", content);

            return response.IsSuccessStatusCode;

        }

        public async Task<bool> DeleteInstitutionMedia(List<int> Ids)
        {
            var jsonData = JsonConvert.SerializeObject(Ids);
            var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/UpdatePersonnel/DeleteInstitutionMedia", content);

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> UpdateRepeatingFieldService(IFormCollection PersonnelInstitutionUpdateData)
        {
            List<vmSaveInstitution> institutions = new List<vmSaveInstitution>();

            var personnelId = PersonnelInstitutionUpdateData["personnelid"];

            foreach (var key in PersonnelInstitutionUpdateData.Keys)
            {
                if (key.StartsWith("institutions[") && (key.Contains("institutionId") || key.Contains("newFieldInstitution")))
                {
                    var index = key.Split(new[] { '[', ']' }, StringSplitOptions.RemoveEmptyEntries)[1];
                    var institutionId = PersonnelInstitutionUpdateData[$"institutions[{index}][institutionId]"];
                    var newFieldInstitutionId = PersonnelInstitutionUpdateData[$"institutions[{index}][newFieldInstitution]"];
                    var graduationYear = PersonnelInstitutionUpdateData[$"institutions[{index}][graduationYear]"];
                    var newFieldGraduationYear = PersonnelInstitutionUpdateData[$"institutions[{index}][newFieldGraduationYear]"];
                    var customDivId = PersonnelInstitutionUpdateData[$"institutions[{index}][customDivId]"];
                    var institutionInfoId = PersonnelInstitutionUpdateData[$"institutions[{index}][institutionInfoId]"];

                    var institutionViewModel = new vmSaveInstitution
                    {
                        Institution = new Institution
                        {
                            InstitutionId = !string.IsNullOrEmpty(institutionId) ? Convert.ToInt32(institutionId) : (!string.IsNullOrEmpty(newFieldInstitutionId) ? Convert.ToInt32(newFieldInstitutionId) : 0),
                            GraduationYear = (short)(!string.IsNullOrEmpty(graduationYear) ? Convert.ToInt16(graduationYear) : (!string.IsNullOrEmpty(newFieldGraduationYear) ? Convert.ToInt16(newFieldGraduationYear) : 0)),
                            PersonnelId = Convert.ToInt16(personnelId),
                            IsActive = true,
                            IsDeleted = false,
                            InstitutionNumber = Convert.ToInt16(customDivId)
                        },
                        MediaLibrary = new List<MediaLibrary>()
                    };

                    if (!string.IsNullOrEmpty(institutionInfoId))
                    {
                        institutionViewModel.Institution.Id = Convert.ToInt32(institutionInfoId);
                    }

                    var imagesKeyPrefix = $"institutions[{index}][images]";
                    var files = PersonnelInstitutionUpdateData.Files.Where(f => f.Name.StartsWith(imagesKeyPrefix)).ToList();

                    foreach (var file in files)
                    {
                        if (file.Length > 0)
                        {
                            var imageLib = new MediaLibrary();
                            var fileName = Path.GetFileName(file.FileName);
                            var newImageName = Guid.NewGuid() + fileName;
                            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/MediaLibrary/", newImageName);
                            imageLib.MediaName = fileName;
                            imageLib.MediaUrl = newImageName;
                            institutionViewModel.MediaLibrary.Add(imageLib);
                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }
                        }
                    }
                    institutions.Add(institutionViewModel);
                }
            }

            if (institutions.Count > 0)
            {
                var jsondata = JsonConvert.SerializeObject(institutions);
                var content = new StringContent(jsondata, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync($"api/UpdatePersonnel/UpdateInstitutionDb", content);
                
                return response.IsSuccessStatusCode;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> InstitutionDataDeleteService(int Id)
        {
            var jsonData = JsonConvert.SerializeObject(Id);
            var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/UpdatePersonnel/InstitutionDataDelete", content);

            return response.IsSuccessStatusCode;
        }
    }

}
