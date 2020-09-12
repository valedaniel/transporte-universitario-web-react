import API from './api';

const TransporteUniversitarioService = {
  async getAll(filter?: any): Promise<any | Error> {
    const res = await API.post('/getAll', { filter });
    return res.data;
  },
  async save(data: any): Promise<any | Error> {
    const res = await API.post('/save', { data });
    return res.data;
  },
  async delete(id: any): Promise<any | Error> {
    const res = await API.delete(`/delete/${id}`);
    return res.data;
  },
};

export default TransporteUniversitarioService;