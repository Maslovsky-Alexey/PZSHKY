using ElectronicSchem.Models.ElectronicSchemModels.Posts;
using ElectronicSchem.Models.ElectronicSchemModels.Tops;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ElectronicSchem.Models.ViewModels
{
    public class PostViewModel
    {
        public long id { get; set; }

        public string title { get; set; }

        public string username { get; set; }

        public string discription { get; set; }

        public string date { get; set; }

        public string userId { get; set; }

        public string category { get; set; }

        public DateTime datetime { get; set; }

        public int rating { get; set; }

        public PostViewModel(PostModel model, CategoryModel category)
        {
            id = model.ID;
            title = model.Title;
            discription = model.Discription.Length > 150 ? model.Discription.Substring(0, 150) + "..." : model.Discription;
            date = model.DatePost.ToString();
            userId = model.UserID;
            this.category = category.Name;
        }
    }
}