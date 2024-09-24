using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OrsaDemoModels.Entity;
using OrsaDemoModels.Entity.VmModel;

namespace OrsaDemoWebApp.Models.Interface

{
    public interface IPersonnelsService
    {

        Task<Personnels> AddPerssonnel(Personnels personnels);
        Task<List<MediaLibrary>> PersonnelSavePhoto(IFormCollection FieldForUploadingPhoto);
        Task<List<ParamInstitution>> GetAllInstitutions();
        Task<bool> SaveInstitutionData(IFormCollection InstitutionData);

    }

    public interface IListPersonnelsService
    {

        //Task<List<Personnels>> ListPersonnels();
        Task<List<vmListPersonnel>> ListPersonnels();

    }

    public interface IUpdatePersonnelService
    {
        Task<vmListPersonnel> EditPersonnelGetData(int Id);
        Task<Personnels> EditPersonnelPutData(Personnels personnels);

        Task<Personnels> DeletePersonnel(Personnels personnels);
        Task<bool> DeletePersonnelPhotos(List<int> Ids);
        Task<bool> DeleteInstitutionMedia(List<int> Ids);
        Task<bool> UpdateRepeatingFieldService(IFormCollection PersonnelInstitutionUpdateData);
        Task<bool> InstitutionDataDeleteService(int Id);

    }

    public interface IGeograpyService
    {

        Task<List<Geography>> GetLocation(int ParentId);
        Task<List<Geography>> GetAllLocations();

    }

}
