import request from "@/utils/request";

const FileAPI = {
  /** 文件上传地址*/
  uploadUrl: "/admin/system/file",

  /**上传文件*/
  upload(file: any, type: "images" | "files" | "avatar" = "images") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    return request<any, FileInfo>({
      url: `${this.uploadUrl}/upload`,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  /**获取列表 */
  getList(groupId: 'images' | 'files' | 'videos' | 'audio') {
    return request({
      url: `${this.uploadUrl}/list`,
      method: "get",
      params: {
        groupId
      }
    });
  },

  /** 删除文件*/
  deleteByPath(filePath?: string) {
    return request({
      url: "/api/v1/files",
      method: "delete",
      params: { filePath: filePath },
    });
  },

  /**
   * 下载文件
   * @param url
   * @param fileName
   */
  downloadFile(url: string, fileName?: string) {
    return request({
      url: url,
      method: "get",
      responseType: "blob",
    }).then((res) => {
      const blob = new Blob([res.data]);
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName || "下载文件";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  },
};

export default FileAPI;

/**
 * 文件API类型声明
 */
export interface FileInfo {
  ext: string;
  path: string;
  size: number;
}
