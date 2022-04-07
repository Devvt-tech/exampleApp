import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IForgotRequest, IForgotResponse, ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse } from '../interfaces/auth.interface';
import { IAvailabilityResponse, IAvilabilitySaveRequest, ICommonResponse, IGenericCommonResponse, ISendEmailRequest, IUser } from '../interfaces/common.interface';
import { ICertificate } from '../interfaces/certificate.interfaces';
import { IQuestion, IQuizz, ISaveQuizzRequest, ISaveQuizzResponse } from '../interfaces/quizzes.interface';
import { CreateOfferRequest, IOffer, IOfferFilter, IOfferList, IProposeDateTimeRequest } from '../interfaces/offer.interfaces';
import { ICalendarResponse, ICreateEventRequest, IEvent, IEventDatesByRange } from '../interfaces/events.interface';
import { ICreateVacancyRequest, IVacancy } from '../interfaces/vacancies.interfaces';
import { DataService } from './data.service';
import { IArea, ICity } from '../interfaces/location.interface';
import { IHire, IHireListResponse, ISaveReviewRequest } from '../interfaces/hires.interface';
import { IInterviewList } from '../interfaces/interview.interfaces';
import { IGetRatingResponse } from '../interfaces/rating.interfaces';
import { ISpecialistFilter, ISpecialistFilterRequest } from '../interfaces/specialist.interfaces';
import { IChat, IChatListResponse, ICreateMessageRequest, ICreateMessageResponse, IGetAllUnreadMessageNumber, IGetMessagesResponse, IMessage, IRemoveMessageResponse } from '../interfaces/messages.interfaces';
import { IAddress, IAddressListResponse } from '../interfaces/address.intertfaces';
import { IFaqQuestion } from '../interfaces/faq.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(
    private http: HttpClient,
    private ds: DataService
  ) { }

  register(model: IRegisterRequest) {
    return this.http.post<IRegisterResponse>(`${this.baseApiUrl}register`, model).toPromise()
  }

  login(model: ILoginRequest) {
    return this.http.post<ILoginResponse>(`${this.baseApiUrl}login`, model).toPromise()
  }

  forgot(model: IForgotRequest) {
    return this.http.post<IForgotResponse>(`${this.baseApiUrl}changePass`, model).toPromise()
  }

  getUser(url: string) {
    return this.http.get<IUser>(`${this.baseApiUrl}${url}`).toPromise()
  }

  getAvailability() {
    return this.http.get<IAvailabilityResponse>(`${this.baseApiUrl}availability`).toPromise()
  }

  setAvailabilities(request: IAvilabilitySaveRequest) {
    return this.http.post<string>(`${this.baseApiUrl}availability`, request).toPromise()
  }

  getCertificates(type: string) {
    return this.http.get<ICertificate[]>(`${this.baseApiUrl}${type}`).toPromise()
  }

  saveCertificates(request: FormData, type: string) {
    return this.http.post<string>(`${this.baseApiUrl}${type}`, request).toPromise()
  }

  getSpecialist() {
    return this.http.get<IUser[]>(`${this.baseApiUrl}getSpecialist`).toPromise()
  }

  filterSpecialist(request: ISpecialistFilterRequest, query: string) {
    return this.http.get<IUser[]>(`${this.baseApiUrl}filterSpecialist?${query}`).toPromise()
  }

  deleteCertificate(id: string, type: string) {
    return this.http.post<string>(`${this.baseApiUrl}certificate/delete`, {id: id, name: type}).toPromise()
  }
  
  getQiuzzes() {
    return this.http.get<IQuizz[]>(`${this.baseApiUrl}quiz`).toPromise()
  }

  getQuestions(id: number) {
    return this.http.post<IQuestion[]>(`${this.baseApiUrl}createquestion`, {id: id}).toPromise()
  }

  saveQuizz(request: ISaveQuizzRequest) {
    return this.http.post<ISaveQuizzResponse>(`${this.baseApiUrl}creteUserQuiz`, request).toPromise()
  }

  createOffer(request: CreateOfferRequest) {
    return this.http.post<boolean>(`${this.baseApiUrl}createOffer`, request).toPromise()
  }

  getCandidateOffers() {
    const route = this.ds.isCompany ? 'offer' : 'offerCandidate';
    return this.http.get<IGenericCommonResponse<IOfferList>>(`${this.baseApiUrl}${route}`).toPromise()
  }

  acceptOffer(id: number, sendResume: boolean, date_id: number, message: string) {
    const route = this.ds.isCompany ? 'acceptCompany' : 'accept';
    return this.http.post<boolean>(`${this.baseApiUrl}${route}`, {offer_id: id, send_resume: sendResume, date_id, message}).toPromise()
  }

  rejectOffer(id: number) {
    const route = this.ds.isCompany ? 'rejectCompany' : 'reject';
    return this.http.post<boolean>(`${this.baseApiUrl}${route}`, {offer_id: id}).toPromise()
  }

  getCompanyOffers() {
    return this.http.get<any>(`${this.baseApiUrl}offer`).toPromise()
  }

  blockOffer(id: number) {
    return this.http.post<boolean>(`${this.baseApiUrl}blockOffer`, {user_id: id}).toPromise()
  }

  filterOffer(filter: IOfferFilter) {
    return this.http.post<IOffer[]>(`${this.baseApiUrl}filterOffer`, filter).toPromise()
  }

  cancelOffer(id: number) {
    return this.http.post<boolean>(`${this.baseApiUrl}destroyOffer`, {offer_id: id}).toPromise()
  }

  archiveOffer(id: number) {
    return this.http.post<boolean>(`${this.baseApiUrl}archiveOffer`, {offer_id: id}).toPromise()
  }

  getCalendarEvents(date: string, search: string) {
    return this.http.get<ICalendarResponse>(`${this.baseApiUrl}calendar?date=${date}&search=${search}`).toPromise()
  }

  createCalendarEvent(model: ICreateEventRequest) {
    return this.http.post<IGenericCommonResponse<IEvent>>(`${this.baseApiUrl}event/store`, model).toPromise()
  }

  
  updateCalendarEvent(model: ICreateEventRequest, id: number) {
    return this.http.put<IGenericCommonResponse<IEvent>>(`${this.baseApiUrl}event/${id}/update`, model).toPromise()
  }

  getInterviews(date: string, search: string) {
    return this.http.post<IOffer[]>(`${this.baseApiUrl}interview`, {date: date, search: search}).toPromise()
  }

  filterInterview(val: string, start: string, end: string) {
    return this.http.get<IGenericCommonResponse<IInterviewList>>(`${this.baseApiUrl}interview/filter?query_text=${val}&start_date=${start}&end_date=${end}`).toPromise()
  }

  createOrUpdateVacancy(vacancyRequest: ICreateVacancyRequest) {
    return this.http.post<IVacancy>(`${this.baseApiUrl}createUpdateVacancy`, vacancyRequest).toPromise()
  }

  getVacancies() {
    return this.http.get<IVacancy[]>(`${this.baseApiUrl}vacancies`).toPromise()
  }

  deleteVacancy(vacancyId: number) {
    return this.http.post<IVacancy>(`${this.baseApiUrl}deleteVacancy`, {vacancy_id: vacancyId}).toPromise()
  }

  archiveVacancy(vacancyId: number) {
    return this.http.post<IVacancy>(`${this.baseApiUrl}archiveVacancy`, {vacancy_id: vacancyId}).toPromise()
  }

  proposeNewDateTime(request: IProposeDateTimeRequest) {
    const route = !this.ds.isCompany ? 'chooseTime' : 'company/offer-choose-time' 
    return this.http.post<boolean>(`${this.baseApiUrl}${route}`, request).toPromise()
  }

  activeVacancy(vacancyId: number) {
    return this.http.post<IVacancy>(`${this.baseApiUrl}activeVacancy`, {vacancy_id: vacancyId}).toPromise()
  }

  getCities() {
    return this.http.get<ICity[]>(`${this.baseApiUrl}cities`).toPromise()
  }

  setLocation(cityId: number, areas: number[]) {
    return this.http.post<boolean>(`${this.baseApiUrl}location`, {city: cityId, areas: areas}).toPromise();
  }

  getAreas(id: number) {
    return this.http.get<IArea[]>(`${this.baseApiUrl}areas/${id}`).toPromise();
  }

  getUserById(id: number) {
    return this.http.post<IUser>(`${this.baseApiUrl}getinfo`, {user_id: id}).toPromise()
  }

  addToSaved(candidate: number, company: number) {
    return this.http.post<any>(`${this.baseApiUrl}favorites/add`, {candidate: candidate, company: company}).toPromise()
  }

  removeFromSaved(candidate: number, company: number) {
    return this.http.post<any>(`${this.baseApiUrl}favorites/remove`, {candidate: candidate, company: company}).toPromise()
  }

  getSavedSpecialist() {
    return this.http.get<IUser[]>(`${this.baseApiUrl}favorites`).toPromise()
  }

  getHires() {
    return this.http.get<IHireListResponse>(`${this.baseApiUrl}hireds`).toPromise()
  }

  hiredAanswer(offerId: number, hiredStatus: boolean) {
    return this.http.post<IHire>(`${this.baseApiUrl}hired-answer`, {offer_id: offerId, hired_status: hiredStatus}).toPromise();
  }

  getEventDatesByRange(start: string, end: string) {
    return this.http.get<IEventDatesByRange>(`${this.baseApiUrl}calendar/busy-dates?start_date=${start}&end_date=${end}`).toPromise();
  }

  interviewListForPeriod(start: string, end: string) {
    return this.http.get<IGenericCommonResponse<IInterviewList>>(`${this.baseApiUrl}interview/list-for-period?start_date=${start}&end_date=${end}`).toPromise();
  }

  removeCalendarEvents(id: number) {
    return this.http.delete<IGenericCommonResponse<any>>(`${this.baseApiUrl}event/${id}/delete`).toPromise();
  }
  getRating() {
    return this.http.get<IGetRatingResponse>(`${this.baseApiUrl}profile/rating/assessment-total`).toPromise();
  }

  leaveRating(offerId: number, model: ISaveReviewRequest) {
    return this.http.post<IHire>(`${this.baseApiUrl}offer-assessment/${offerId}/leave-rating`, model).toPromise();
  }

  changeOnDemand(value: number) {
    return this.http.put<any>(`${this.baseApiUrl}general/type-employment-on-demand-update`, {is_on_demand: value}).toPromise();
  }

  loadChatList() {
    return this.http.get<IChatListResponse>(`${this.baseApiUrl}chat/list`).toPromise();
  }

  createMessage(model: ICreateMessageRequest) {
    return this.http.post<IGenericCommonResponse<ICreateMessageResponse>>(`${this.baseApiUrl}chat/message/create`, model).toPromise();
  }

  getMessageByChatId(chatId: number) {
    return this.http.get<IGenericCommonResponse<IGetMessagesResponse>>(`${this.baseApiUrl}chat/${chatId}/message/list`).toPromise();
  }

  markAsRead(ids: number[]) {
    return this.http.put<any>(`${this.baseApiUrl}chat/message/set-read`, {'ids': ids}).toPromise();
    
  }

  getAllUnreadMessageNumber() {
    return this.http.get<IGenericCommonResponse<IGetAllUnreadMessageNumber>>(`${this.baseApiUrl}chat/number-all-unread-messages`).toPromise();
  }

  removeMessage(messageId: number) {
    return this.http.delete<IGenericCommonResponse<IRemoveMessageResponse>>(`${this.baseApiUrl}chat/message/${messageId}/delete`).toPromise();
  }
  
  editOffer(request: CreateOfferRequest) {
    return this.http.put<boolean>(`${this.baseApiUrl}editOffer/${request.id}`, request).toPromise()
  }

  createAddress(request: IAddress) {
    return this.http.post<IGenericCommonResponse<boolean>>(`${this.baseApiUrl}company-address/create`, request).toPromise()
  }

  editAddress(request: IAddress) {
    return this.http.put<IGenericCommonResponse<boolean>>(`${this.baseApiUrl}company-address/edit/${request.id}`, request).toPromise()
  }

  loadAddresses() {
    return this.http.get<IGenericCommonResponse<IAddressListResponse>>(`${this.baseApiUrl}company-address/list`).toPromise()
  }

  deleteAddress(id: number) {
    return this.http.delete<IGenericCommonResponse<boolean>>(`${this.baseApiUrl}company-address/delete/${id}`).toPromise()
  }

  getOfferById(offerId: number) {
    return this.http.get<IGenericCommonResponse<IOffer>>(`${this.baseApiUrl}offer-detail/${offerId}`).toPromise()
  }

  interviewHistory() {
    return this.http.get<IGenericCommonResponse<IInterviewList>>(`${this.baseApiUrl}interview/history`).toPromise();
  }

  getUnreadOfferNumber() {
    const route = this.ds.isCompany ? 'get/unread/offer/company' : 'get/unread/offer/user';
    return this.http.post<number>(`${this.baseApiUrl}${route}`, {user_id: this.ds.user$.value.id}).toPromise();
  }

  markOfferAsRead(id: number) {
    return this.http.post<boolean>(`${this.baseApiUrl}${`offer/mark-as-read`}`, {offer_id: id}).toPromise()
  }

  contactUs(request: ISendEmailRequest) {
    return this.http.post<boolean>(`${this.baseApiUrl}${`send/mail`}`, request).toPromise()
  }

  loadFAQ() {
    return this.http.get<IFaqQuestion[]>(`${this.baseApiUrl}faq`).toPromise();
  }

  getCalendarEventsByRange(start: string, end: string, search: string) {
    return this.http.get<ICalendarResponse>(`${this.baseApiUrl}calendar/between?start_date=${start}&end_date=${end}&search=${search}`).toPromise()
  }

}

