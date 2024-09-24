using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Security;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;
using OrsaDemoModels.Entity;
using OrsaDemoWebApp.Models.Interface;
using OrsaDemoWebApp.Helpers;
using OrsaDemoModels.Entity.VmModel;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace OrsaDemoWebApp.Service
{
    public class PersonnelsService : IPersonnelsService
    {

        private readonly HttpClient _httpClient;    // Create an HttpClient object
        
        public PersonnelsService(HttpClient httpClient)
        {

            var getHttp = new HttpClientBuilder();
            _httpClient = getHttp.httpbuilder(httpClient);

        }

        public async Task<Personnels> AddPerssonnel(Personnels personnels)
        {
            
            try
            {
                var jsonData = JsonConvert.SerializeObject(personnels);    // Convert the data into json format
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");    // Make JSON formated data a string to use in code
                var response = await _httpClient.PostAsync($"api/Personnels/SavePersonnels", content); // Give the content to API via Http Client


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

        public async Task<List<ParamInstitution>> GetAllInstitutions()
        {
            var response = await _httpClient.GetAsync($"api/Personnels/GetAllInstitutions");

            if (response.IsSuccessStatusCode)
            {

                var responseData = await response.Content.ReadAsStringAsync();    // Get response data as a string
                var result = JsonConvert.DeserializeObject<List<ParamInstitution>>(responseData);    // Convert response data to Personnels from JSON format

                return result;

            }
            else
            {

                return null;

            }
        }

        public async Task<List<MediaLibrary>> PersonnelSavePhoto(IFormCollection FieldForUploadingPhoto)
        {
            List<string> filenames = new List<string>();
            var media = new List<MediaLibrary>();

            foreach(var file in FieldForUploadingPhoto.Files)
            {

                var filename = Path.GetFileName(file.FileName);
                var newImageName = Guid.NewGuid() + filename;
                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/MediaLibrary", newImageName);

                using (var stream = new FileStream(filepath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                filenames.Add(newImageName);
                /*var medium = new MediaLibrary
                {
                    MediaName = filename,
                    MediaUrl = newImageName,
                };
                media.Add(medium);*/
                string personnelIdValue = null; 
                foreach (string key in FieldForUploadingPhoto.Keys)
                {

                    if (key.Contains("PersonnelId"))
                    {
                        
                        string valueString = FieldForUploadingPhoto[key];
                        string[] values = valueString.ToString().Split(',');
                        if (values.Length > 0)
                        {

                            personnelIdValue = values[0];
                            long personnelId = Convert.ToInt64(personnelIdValue);
                            var medium = new MediaLibrary
                            {

                                Id = personnelId,
                                MediaName = filename,
                                MediaUrl = newImageName,

                            };
                            media.Add(medium);

                        }

                    }

                }

            }

            try
            {
                var jsonData = JsonConvert.SerializeObject(media);    // Convert the data into json format
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");    // Make JSON formated data a string to use in code
                var response = await _httpClient.PostAsync($"api/Personnels/SavePersonnelMedia", content); // Give the content to API via Http Client


                if (response.IsSuccessStatusCode)
                {

                    var responseData = await response.Content.ReadAsStringAsync();    // Get response data as a string
                    var result = JsonConvert.DeserializeObject<List<MediaLibrary>>(responseData);    // Convert response data to Personnels from JSON format
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

        public async Task<bool> SaveInstitutionData(IFormCollection InstitutionData)
        {

            List<vmSaveInstitution> institutions = new List<vmSaveInstitution>();

            foreach (var key in InstitutionData.Keys)
            {

                if (key.StartsWith("institution_"))
                {

                    var institutionNo = int.Parse(key.Split('_')[1]);
                    var getInstitutionId = InstitutionData["institution_" + institutionNo];
                    var graduationYear = InstitutionData["graduation_" + institutionNo];
                    var personnelId = InstitutionData["personnelId"];

                    var customDivNumber = InstitutionData["customDivNumber_" + institutionNo];

                    var vmInstitution = new vmSaveInstitution
                    {

                        Institution = new Institution
                        {

                            InstitutionId = Convert.ToInt32(getInstitutionId),
                            GraduationYear = Convert.ToInt32(graduationYear),
                            PersonnelId = Convert.ToInt32(personnelId),
                            IsActive = true,
                            IsDeleted = false,
                            InstitutionNumber = Convert.ToInt32(customDivNumber),

                        },
                        MediaLibrary = new List<MediaLibrary>()

                    };

                    var imageKey = key.Replace("institution_", "institutionImage_");
                    var files = InstitutionData.Files.GetFiles(imageKey);

                    foreach (var file in files)
                    {

                        if (file.Length > 0)
                        {

                            var imageName = new MediaLibrary();
                            var fileName = Path.GetFileName(file.FileName);
                            var newImageName = Guid.NewGuid() + fileName;
                            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/MediaLibrary/", newImageName);
                            imageName.MediaName = fileName;
                            imageName.MediaUrl = newImageName;
                            vmInstitution.MediaLibrary.Add(imageName);
                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {

                                await file.CopyToAsync(stream);

                            }

                        }

                    }

                    institutions.Add(vmInstitution);

                }

            }

            if (institutions.Count > 0)
            {

                var jsondata = JsonConvert.SerializeObject(institutions);
                var content = new StringContent(jsondata, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"api/Personnels/SaveInstitutionData", content);

                return response.IsSuccessStatusCode;

            }
            else
            {

                return false;

            }

        }

    }

}


/*public PersonnelsService(HttpClient httpClient)    // 
{

    // Create a HttpClientBuilder object to build one
    var httpal = new HttpClientBuilder();
    // Build the Http Client
    _httpClient = httpal.httpbuilder(httpClient);

}*/

/*
private readonly HttpClient _httpClient;
public PersonnelsService(HttpClient httpClient)
{

    var httpal = new HttpClientBuilder();
    _httpClient = httpal.httpbuilder(httpClient);

}

public async Task<Personnels> AddPerssonnelService(Personnels personnels)
{

    var jsondata = JsonConvert.SerializeObject(personnels);
    var content = new StringContent(jsondata, Encoding.UTF8, "application/json");
    var response = await _httpClient.PostAsync($"api/Personnels/SavePersonnel", content);

    if (response.IsSuccessStatusCode)
    {
        var responsedata = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<Personnels>(responsedata);
        return result;

    }
    else
    {
        return null;
    }

}
*/