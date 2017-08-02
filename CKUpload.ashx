<%@ WebHandler Language="C#" Class="CKUpload" %>

using System;
using System.Web;

public class CKUpload : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        HttpPostedFile file = context.Request.Files[0];
        string name = string.Concat(Guid.NewGuid().ToString(), System.IO.Path.GetExtension(file.FileName));
        file.SaveAs(string.Concat(context.Server.MapPath("./Upload/"), name));
        context.Response.ContentType = "text/html";
        string num = context.Request.QueryString["CKEditorFuncNum"];
        /*
         * <script type="text/javascript">
         *    window.parent.CKEDITOR.tools.callFunction("0", "\/userfiles\/files\/Public%20Folder\/001.jpg", "");
         * </script>   
         */
        string content = string.Format("<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction({0},\"/wwwroot/Upload/{1}\",\"\");</script>", num, name);

        context.Response.Write(content);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}