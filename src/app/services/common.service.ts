import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { State } from "../ums/masters/states/state.model";
import { Observable } from "rxjs";
import { Country } from "../ums/masters/countries/country.model";
import { Branch } from "../ums/masters/branch/branch.model";
import { City } from "../Models/ums/city.model";
import { Designation } from "../Models/ums/designation.model";
import { Department } from "../ums/masters/department/department.model";
import { Employee } from "../ums/masters/employee/employee.model";
import { Currency } from "../ums/masters/currencies/currency.model";
import { AccessControlTemplate } from "../ums/masters/access-control-template/act.model";
import {
  AuthorizationMatrix,
  UserHeader,
  UserMenusAction,
} from "../Models/ums/user.model";
import Swal from "sweetalert2";
import { environment } from "src/environments/environment.development";
import {
  AddressCategorys, ApprovalStatusModel, BillingCurrencys, CVTypeModel, CalculationParameters, CalculationTypes, CargoTypes, DefaultSettings, DocumentChecklists, Dropdown, ExchangeModel, Intrestlevel, ModeofFollowUp,
  ModeofTransports,
  PQAgainst, PQStatus, RFQStatus, ReportingStageModel, RfqAgainst, ServiceSector, ShipmentTypes, StatsuTypeInPVs, StatusTypeInC, StatusTypeInPC,
  Transport,
  VendorRankings,
  VendorStatus,
  cDocument,
  groupCompany,
  quotationAgainst,
  quotationCRStatus,
  quotationStatus,
  sourceFrom
} from "../Models/crm/master/Dropdowns";
import { FollowupBaseDoc, FollowupStatus } from "../Models/crm/master/Dropdowns";
import { CustomerCategory } from "../Models/crm/master/transactions/CustomerCategory";
import { EnquiryStatus } from "../Models/crm/master/transactions/Enquirystatus";
import { SalesFunnel } from "../Models/crm/master/transactions/SalesFunnels";
import { Airport } from "../Models/crm/master/Airport";
import { Seaport } from "../Models/crm/master/Seaport";
import { TaxCode } from "../crm/master/taxcode/taxcode.model";
import { vendorQuotationFilterList } from "../qms/transaction/Quotations/quotation-model/quote";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private http: HttpClient) { }

  countries: Country[] = [];

  getDesignations(id: number): Observable<Designation[]> {
    return this.http.get<Designation[]>(
      environment.apiUrl + "Designation/GetAllDesignation" + "/" + id
    );
  }

  getDepartments(id: number): Observable<Department[]> {
    return this.http.get<Department[]>(
      environment.apiUrl + "Department/GetAllDepartments" + "/" + id
    );
  }

  getCountries(id: number): Observable<Country[]> {
    return this.http.get<Country[]>(
      environment.apiUrl + "Country/GetAllCountry" + "/" + id
    );
  }
  getAllCity(id: number) {
    return this.http.get<City[]>(
      environment.apiUrl + "City/GetAllCities/" + id);
  }

  getCurrencies(id: number): Observable<Currency[]> {
    return this.http.get<Currency[]>(
      environment.apiUrl + "Currency/GetAllCurrency" + "/" + id
    );
  }

  getBranches(id: number): Observable<Branch[]> {
    return this.http.get<Branch[]>(environment.apiUrl + "Branch/GetAllBranch" + "/" + id);
  }

  getEmployees(id: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      environment.apiUrl + "Employee/GetAllEmployee" + "/" + id
    );
  }

  getStatesForSelectedCountry(selectedCountryId: number) {
    return this.http.get<State[]>(
      environment.apiUrl + "States/StatesbyCountryId/" + selectedCountryId
    );
  }

  getCityForSelectedState(selectedStateId: number) {
    return this.http.get<City[]>(
      environment.apiUrl + "City/CitiesbystateId/" + selectedStateId
    );
  }

  getActs(): Observable<AccessControlTemplate[]> {
    return this.http.get<AccessControlTemplate[]>(
      environment.apiUrl + "AccessControlTemplate/GetAllAct"
    );
  }

  getUsers(): Observable<UserHeader[]> {
    return this.http.get<UserHeader[]>(
      environment.apiUrl + "UserCreation_Mapping/GetAllUsers"
    );
  }

  getAuthorizationMatrix(id: number): Observable<AuthorizationMatrix[]> {
    return this.http.get<AuthorizationMatrix[]>(environment.apiUrl + "Authorizationmatrix/GetAllAuthorizationMatrix" + '/' + id);
  }

  getUserMenuActions(): Observable<UserMenusAction[]> {
    return this.http.get<UserMenusAction[]>(
      environment.apiUrl + "UserCreation_Mapping/GetAllMenuActions"
    );
  }

  displayToaster(icon: any, title: string, msg: string) {
    Swal.fire({
      icon: icon,
      title: title,
      text: msg,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  getBillingCurrencies(id: number): Observable<BillingCurrencys[]> {
    return this.http.get<BillingCurrencys[]>(
      environment.apiUrl + "DropDown/GetAllBillingCurrency");
  }
  getAllStatus() {
    return this.http.get<StatusTypeInPC[]>(
      environment.apiUrl + "DropDown/GetAllStatusTypeInPC");
  }
  getAllStatusVendor() {
    return this.http.get<StatsuTypeInPVs[]>(
      environment.apiUrl + "DropDown/GetAllStatsuTypeInPVs");
  }
  getAllModeofTransport() {
    return this.http.get<ModeofTransports[]>(
      environment.apiUrl + "DropDown/GetAllModeofTransport");
  }
  getAllCStatus() {
    return this.http.get<StatusTypeInC[]>(
      environment.apiUrl + "DropDown/GetAllStatusTypeInC");
  }
  getAllCommunication() {
    return this.http.get<ModeofFollowUp[]>(
      environment.apiUrl + "DropDown/GetAllModeofFollowUps");
  }
  getAllInterest() {
    return this.http.get<Intrestlevel[]>(
      environment.apiUrl + "DropDown/GetAllInterestlevels");
  }
  getAllCVType() {
    return this.http.get<CVTypeModel[]>(
      environment.apiUrl + "DropDown/GetAllCVType");
  }
  getAllReportingStage() {
    return this.http.get<ReportingStageModel[]>(
      environment.apiUrl + "DropDown/GetAllReportingStages");
  }

  getAllPQAgainst() {
    return this.http.get<PQAgainst[]>(
      environment.apiUrl + "DropDown/GetAllPQAgainst");
  }
  getAllCargo() {
    return this.http.get<CargoTypes[]>(
      environment.apiUrl + "DropDown/GetAllCargoTypes");
  }
  getAllCitiesbyCountry(id: any) {
    return this.http.get<City[]>(
      environment.apiUrl + "City/GetAllCitiesByCountryId/" + id);
  }
  GetAllShipmentTypes() {
    return this.http.get<ShipmentTypes[]>(
      environment.apiUrl + "DropDown/GetAllShipmentTypes");
  }
  GetAllRFQStatus() {
    return this.http.get<RFQStatus[]>(
      environment.apiUrl + "DropDown/GetAllRFQStatus");
  }
  GetAllPQStatus() {
    return this.http.get<PQStatus[]>(
      environment.apiUrl + "DropDown/GetAllPQStatus");
  }
  getAllFollowupBaseDoc() {
    return this.http.get<FollowupBaseDoc[]>(
      environment.apiUrl + "DropDown/GetAllFollowupBaseDoc");
  }

  getAllFollowupStatus() {
    return this.http.get<FollowupStatus[]>(
      environment.apiUrl + "DropDown/GetAllFollowUpStatusdrp");
  }

  getAllCustomerCategory() {
    return this.http.get<CustomerCategory[]>(
      environment.apiUrl + "DropDown/GetAllCustomerCategory");
  }


  getAllEnquiryStatus() {
    return this.http.get<EnquiryStatus[]>(
      environment.apiUrl + "DropDown/GetAllEnquiryStatusdrp");
  }

  getAllSalesFunnels() {
    return this.http.get<SalesFunnel[]>(
      environment.apiUrl + "DropDown/GetAllSalesFunnels");
  }
  GetAllGroupCompany() {
    return this.http.get<groupCompany[]>(
      environment.apiUrl + "DropDown/GetAllGroupCompany");
  }
  getAllTransportType() {
    return this.http.get<Transport[]>(
      environment.apiUrl + "DropDown/GetAllTransportTypes");
  }


  getAllAirport(id: number) {
    return this.http.get<Airport[]>(
      environment.apiUrl + "Airport/GetAllActiveAirport/" + id);
  }

  getAllSeaport(id: number) {
    return this.http.get<Seaport[]>(
      environment.apiUrl + "Seaport/GetAllActiveSeaport/" + id);
  }

  GetAllActiveTaxCodes() {
    return this.http.get<TaxCode[]>(
      environment.apiUrl + "TaxCode/TaxCodeGetAllActive");
  }
  GetAllCalculationParameter() {
    return this.http.get<CalculationParameters[]>(
      environment.apiUrl + "DropDown/GetAllCalculationParameter");
  }
  GetAllCalculationType() {
    return this.http.get<CalculationTypes[]>(
      environment.apiUrl + "DropDown/GetAllCalculationType");
  }

  GetAllRfqAgainst() {
    return this.http.get<RfqAgainst[]>(
      environment.apiUrl + "DropDown/GetAllRfqAgainst");
  }

  GetAllRfqstatus() {
    return this.http.get<any[]>(
      environment.apiUrl + "DropDown/GetAllRFQStatus");
  }
  GetAllVendorRanking() {
    return this.http.get<VendorRankings[]>(
      environment.apiUrl + "DropDown/GetAllVendorRanking");
  }
  GetAllVendorStatus() {
    return this.http.get<VendorStatus[]>(
      environment.apiUrl + "DropDown/GetAllVendorStatus");
  }
  GetAllAddressCategory() {
    return this.http.get<AddressCategorys[]>(
      environment.apiUrl + "DropDown/GetAllAddressCategory");
  }
  GetAllCDocument() {
    return this.http.get<cDocument[]>(
      environment.apiUrl + "DropDown/GetAllCDocument");
  }
  GetAllDocumentChecklist(): Observable<DocumentChecklists[]> {
    return this.http.get<DocumentChecklists[]>(
      environment.apiUrl + "DropDown/GetAllDocumentChecklist"
    );
  }
  GetAllServiceSector(): Observable<ServiceSector[]> {
    return this.http.get<ServiceSector[]>(
      environment.apiUrl + "DropDown/GetAllServiceSector"
    );
  }
  GetAllApprovalStatus(): Observable<ApprovalStatusModel[]> {
    return this.http.get<ApprovalStatusModel[]>(
      environment.apiUrl + "DropDown/GetAllApprovalStatus"
    );
  }


  GetAllAirportByCountryId(id: number): Observable<Airport[]> {
    return this.http.get<Airport[]>(
      environment.apiUrl + "Airport/GetAllAirportByCountryId/" + id
    );
  }
  GetAllSeaportByCountryId(id: number): Observable<Seaport[]> {
    return this.http.get<Seaport[]>(
      environment.apiUrl + "Seaport/GetAllSeaportByCountryId/" + id
    );
  }
  DownloadFile(fileName: string): Observable<Blob> {
    const url = `${environment.apiUrl}PartMaster/DownloadFile/${fileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  GetAllQAgainst(): Observable<quotationAgainst[]> {
    return this.http.get<quotationAgainst[]>(
      environment.apiUrl + "DropDown/GetAllQAgainst"
    );
  }

  GetAllQStatus(): Observable<quotationStatus[]> {
    return this.http.get<quotationStatus[]>(
      environment.apiUrl + "DropDown/GetAllQStatus"
    );
  }

  GetAllQCRStatus(): Observable<quotationCRStatus[]> {
    return this.http.get<quotationCRStatus[]>(
      environment.apiUrl + "DropDown/GetAllQCRStatus"
    );
  }
  GetAllSourceFrom(): Observable<sourceFrom[]> {
    return this.http.get<sourceFrom[]>(
      environment.apiUrl + "DropDown/GetAllSourceFrom"
    );
  }


  GetAllPQandContract(Data: any): Observable<vendorQuotationFilterList[]> {
    return this.http.post<vendorQuotationFilterList[]>(
      environment.apiUrl + "DropDown/GetAllPQandContract", Data
    );
  }

  GetAllDisplayTypes() {
    return this.http.get<any[]>(
      environment.apiUrl + "DropDown/GetAllDisplayType");
  }

  GetExchangeById(id: number): Observable<ExchangeModel> {
    return this.http.get<ExchangeModel>(
      environment.apiUrl + "DropDown/GetExchangeById/" + id
    );
  }

  GetSourceStatus() {
    let url = environment.apiUrl + "DropDown/GetSourceStatus";
    return this.http.get(url);
  }

  GetAllDefaultSettings(): Observable<DefaultSettings[]> {
    return this.http.get<DefaultSettings[]>(
      environment.apiUrl + "DropDown/DefaultSettings"
    );
  }
  GetHSCodeByPartAndCountryId(partId: any, originId: any, destinationId: any) {
    let url = environment.apiUrl + `DropDown/GetHSCodeByPartAndCountryId?partId=${partId}&originId=${originId}&destinationId=${destinationId}`;
    return this.http.get(url)
  }
  GetSearchByDropdownByScreenId(screenId: any) {
    let url = environment.apiUrl + `DropDown/GetSearchByDropdownByScreenId?screenId=${screenId}`;
    return this.http.get(url);
  }
  GetScreenIdByName(name: any) {
    let url = environment.apiUrl + `DropDown/GetScreenIdByName?screenName=${name}`;
    return this.http.get(url);
  }

  GetJTPredefinedStage() {
    let url = environment.apiUrl + "DropDown/GetJTPredefinedStage";
    return this.http.get(url);
  }
  GetUnknownValuesId() {
    let url = environment.apiUrl + "DropDown/GetUnknownValuesId";
    return this.http.get(url);
  }
  GetAllEnquiryNo() {
    return this.http.get<Dropdown[]>(
      environment.apiUrl + "DropDown/GetAllEnquiryNo");
  }
  GetAllJobOrderNo() {
    return this.http.get<Dropdown[]>(
      environment.apiUrl + "DropDown/GetAllJobOrderNo");
  }
  GetAllRfqNo() {
    return this.http.get<Dropdown[]>(
      environment.apiUrl + "DropDown/GetAllRfqNo");
  }
  GetAllRFQStatuss() {
    return this.http.get<Dropdown[]>(
      environment.apiUrl + "DropDown/GetAllRfqStatuss");
  }
}